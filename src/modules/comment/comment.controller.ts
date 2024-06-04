import { Body, Controller, Headers, HttpException, HttpStatus, Injectable, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CommentService } from "./comment.service";
import JwtAuthenticationGuard from "../auth/jwt-authentication.guard";
import { CreateCommentRequest } from "src/common/validators/comment/request/create";
import { globalMessages } from "src/utils/global-messages";
import { Language } from "src/common/validators/language";

@Controller('comments')
export class CommentController {
    constructor(private commentService: CommentService) { }


    @UseGuards(JwtAuthenticationGuard)
    @UsePipes(new ValidationPipe())
    @Post('')
    async create(@Headers() headers: Object, @Body() createCommentRequest: CreateCommentRequest) {
        if(!headers['accept-language']) {
            throw new HttpException(
                globalMessages['fr'].error.missingLanguage,
                HttpStatus.UNAUTHORIZED
            );
        }
        const language: Language = headers['accept-language']
        const token = headers['set-cookie']
        return this.commentService.create(language, createCommentRequest, token);
    }
}