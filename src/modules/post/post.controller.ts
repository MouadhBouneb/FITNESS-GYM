import {
    Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Post
    , Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { PostService } from "./post.service";
import { Roles } from "src/common/decorators/roles.decorator";
import JwtAuthenticationGuard from "../auth/jwt-authentication.guard";
import { RoleGuard } from "../auth/role.guard";
import { CreatePostRequest } from "src/common/validators/post/request/create";
import { PaginateQuery } from "nestjs-paginate";
import { globalMessages } from "src/utils/global-messages";
import { Language } from "src/common/validators/language";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptionsPostPhotos } from "src/utils/photo-upload-config";
import { Request } from "express";

@ApiTags('posts')
@Controller('posts')
export class PostController {
    constructor(private postService: PostService) { }

    @Roles('ROOT', 'ADMIN')
    @Post()
    @UseGuards(JwtAuthenticationGuard, RoleGuard)
    @UsePipes(new ValidationPipe())
    @ApiBody({
        type: CreatePostRequest,
        description: 'Json structure for post object'
    })
    @UseInterceptors(FileInterceptor('file',multerOptionsPostPhotos))
    createPost(@Headers() headers: Object, @Body() postDto: CreatePostRequest,
    @UploadedFile() file?: Express.Multer.File) {
        if (!headers['accept-language']) {
            throw new HttpException(
                globalMessages['fr'].error.missingLanguage,
                HttpStatus.UNAUTHORIZED
            );
        }       
        const language: Language = headers['accept-language']
        return this.postService.create(postDto,file);
    }
    @Get()
    @UseGuards(JwtAuthenticationGuard)
    getAll(@Headers() headers: Object,@Query() query: PaginateQuery) {
        if (!headers['accept-language']) {
            throw new HttpException(
                globalMessages['fr'].error.missingLanguage,
                HttpStatus.UNAUTHORIZED
            );
        }
        const language: Language = headers['accept-language']
        return this.postService.getAll(language, query);
    }
    @Delete(':id')
    @UseGuards(JwtAuthenticationGuard)
    deleteById(@Headers() headers: Object, @Req() request: Request) {
        if (!headers['accept-language']) {
            throw new HttpException(
                globalMessages['fr'].error.missingLanguage,
                HttpStatus.UNAUTHORIZED
            );
        }
        const language: Language = headers['accept-language']
        const id = request?.body?.id
        if (!id) {
            throw new HttpException(
                globalMessages[language].error.missingId,
                HttpStatus.UNAUTHORIZED
            );
        }
        return this.postService.deleteById(id);
    }
}