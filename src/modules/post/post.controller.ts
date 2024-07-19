import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreatePostRequest } from 'src/common/validators/post/request/create';
import { PaginateQuery } from 'nestjs-paginate';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsPostPhotos } from 'src/utils/photo-upload-config';
import { Request } from 'express';
import { AuthentificationService } from '../auth/authentification.service';
import { createLikeRequest } from 'src/common/validators/like/request/create';
import { CreateCommentRequest } from 'src/common/validators/comment/request/create';
import { DeleteCommentRequest } from 'src/common/validators/comment/request/delete';
import { deleteLikeRequest } from 'src/common/validators/like/request/delete';
import { UpdateCommentRequest } from 'src/common/validators/comment/request/update';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly authenticationService: AuthentificationService
  ) {}

  @Roles('ADMIN', 'ROOT')
  @Post('')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreatePostRequest,
    description: 'Json structure for post object'
  })
  @UseInterceptors(FileInterceptor('file', multerOptionsPostPhotos))
  async createPost(
    @Headers() headers: any,
    @Body() postDto: CreatePostRequest,
    @UploadedFile() file?: Express.Multer.File
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const post = await this.postService.create(postDto);
    const returnPost = post;
    returnPost['photo'] = await this.postService.setPhoto(language, post, file);

    return returnPost;
  }
  @Get()
  @UseGuards(JwtAuthenticationGuard)
  async getAll(@Headers() headers: any, @Query() query: PaginateQuery, @Req() request: Request) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);

    return this.postService.getAll(language, query, user);
  }
  @Post('like')
  @UseGuards(JwtAuthenticationGuard)
  async likePost(
    @Headers() headers: any,
    @Req() request: Request,
    @Body() likeReq: createLikeRequest
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);

    console.log(likeReq);

    return this.postService.likePost(language, likeReq.postId, user);
  }

  @Post('unlike')
  @UseGuards(JwtAuthenticationGuard)
  async unlikePost(
    @Headers() headers: any,
    @Req() request: Request,
    @Body() deleteLike: deleteLikeRequest
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);
    return this.postService.unlikePost(deleteLike.likeId, user.id);
  }

  @Post('createComment')
  @UseGuards(JwtAuthenticationGuard)
  async createComment(
    @Headers() headers: any,
    @Req() request: Request,
    @Body() createCommentRequest: CreateCommentRequest
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);
    if (!user) {
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    return this.postService.createComment(createCommentRequest, user);
  }
  @Post('editComment')
  @UseGuards(JwtAuthenticationGuard)
  async editComment(
    @Headers() headers: any,
    @Req() request: Request,
    @Body() updateCommentReq: UpdateCommentRequest
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);
    if (!user) {
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    return this.postService.updateComment(updateCommentReq, user, language);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('deleteComment')
  async deleteComment(
    @Body() commentDeleteReq: DeleteCommentRequest,
    @Req() request: Request,
    @Headers() headers: any
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const user = await this.authenticationService.verifyToken(language, token);
    return this.postService.deleteComment(language, user.id, commentDeleteReq);
  }
}
