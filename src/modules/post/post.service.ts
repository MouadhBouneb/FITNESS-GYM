import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Post } from "./post.entity";
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from "nestjs-paginate";
import { Language } from "src/common/validators/language";
import { globalMessages } from "src/utils/global-messages";
import { CreatePostRequest } from "src/common/validators/post/request/create";
import { AttachementService } from "../attachement/attachement.service";


@Injectable()
export class PostService {
    constructor(@InjectRepository(Post) private postRepository: Repository<Post>,
private readonly attachmentService: AttachementService) {}
    async getAll(language: Language, query: PaginateQuery): Promise<Paginated<Post>> {
        if (!query) {
            throw new HttpException(
                globalMessages[language].error.missingQuery,
                HttpStatus.BAD_REQUEST
            )
        }
        const paginatedResult = await paginate(query, this.postRepository, {
            relations:['comments','likes','photo'],
            sortableColumns: ["updatedAt"],
            defaultSortBy: [["updatedAt", "DESC"]],
            defaultLimit: 10,
            maxLimit: 50
        })
        console.log(paginatedResult?.data);
        
        if (!paginatedResult?.data || !(paginatedResult?.data?.length > 0)) {
            throw new HttpException(
                globalMessages[language].error.noPostsFound,
                HttpStatus.BAD_REQUEST
            )
        }
        return paginatedResult
    }

    async create(post: CreatePostRequest, image: Express.Multer.File): Promise<Post> {

        const createdPost = this.postRepository.create(post)
        const createdPhoto = await this.attachmentService.createPostImage(createdPost.id, image)
        const newPost = { ...createdPost,photo: createdPhoto }

        return await this.postRepository.save(newPost)
    }

    async deleteById(id: number) {
        return this.postRepository.delete(id);
    }

    async getOne(id:number){
        return this.postRepository.findOneBy({id:id})
    }

}