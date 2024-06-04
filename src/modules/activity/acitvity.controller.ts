import {
    Body, Controller, Delete, Get, Headers, HttpException, HttpStatus, Post
    , Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
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
import { CreateActivityRequest } from "src/common/validators/activity/request/create";
import { ActivityService } from "./activity.service";

@ApiTags('activities')
@Controller('activities')
export class ActivityController {
    constructor(
        private readonly activityService: ActivityService
    ) { }

    @Roles('ADMIN', 'ROOT')
    @UseGuards(JwtAuthenticationGuard, RoleGuard)
    @Post()
    async createActivity(@Body() activityReq: CreateActivityRequest, @Headers() headers: Object) {
        return this.activityService.create(activityReq)
    }
}