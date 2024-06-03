import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCommentRequest } from "src/common/validators/comment/Request/create";
import { Language } from "src/common/validators/language";
import {Repository} from "typeorm"
import { AuthentificationService } from "../auth/authentification.service";
import { PostService } from "../post/post.service";
import { Comment } from "./comment.entity";

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private  commentRepository: Repository<Comment>,
        private readonly postService: PostService ,
        private readonly authenticationService: AuthentificationService ,
    ){}
    async create(language:

            Language,createCommentRequest: CreateCommentRequest,token:string): Promise<Comment> {
            const user = await this.authenticationService.verifyToken(language,token)
            const post = await this.postService.getOne(createCommentRequest.postId)
            const content = createCommentRequest.content
            const newComment = this.commentRepository.create({post:post,user:user,comment:content});
            return this.commentRepository.save(newComment);
        }
        
}