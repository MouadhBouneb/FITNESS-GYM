import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { Language } from 'src/common/validators/language';
import { globalMessages } from 'src/utils/global-messages';
import { CreatePostRequest } from 'src/common/validators/post/request/create';
import { AttachementService } from '../attachement/attachement.service';
import { User } from '../user/user.entity';
import { LikeService } from '../like/like.service';
import { CommentService } from '../comment/comment.service';
import { DeleteCommentRequest } from 'src/common/validators/comment/request/delete';
import { CreateCommentRequest } from 'src/common/validators/comment/request/create';
import { UpdateCommentRequest } from 'src/common/validators/comment/request/update';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly attachmentService: AttachementService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService
  ) {}
  async getAll(language: Language, query: PaginateQuery, user: User) {
    if (!query) {
      throw new HttpException(globalMessages[language].error.missingQuery, HttpStatus.BAD_REQUEST);
    }
    const paginatedResult = await paginate(query, this.postRepository, {
      relations: {
        likes: true,
        photo: true,
        comments: { user: { photo: true } }
      },
      sortableColumns: ['updatedAt'],
      defaultSortBy: [['updatedAt', 'DESC']],
      defaultLimit: 10,
      maxLimit: 50
    });
    if (!paginatedResult?.data || !(paginatedResult?.data?.length > 0)) {
      throw new HttpException(globalMessages[language].error.noPostsFound, HttpStatus.BAD_REQUEST);
    }
    const data = paginatedResult.data as Array<any>;
    for (const el of data) {
      console.log({ id: el['id'], user: { id: user.id } });
      const like = await this.likeService.findOneWithUser(el['id'], user.id);

      if (like) {
        el['isLiked'] = { status: true, likeId: like.id };
      }
      el['photo'] = await this.attachmentService.getBase64File(el['photo']);
      for (const comment of el['comments']) {
        if (this.isEditable(comment, user)) {
          comment['isEditable'] = true;
        }
        const cmntUser = comment['user'];
        if (cmntUser['photo'])
          comment['photo'] = await this.attachmentService.getBase64File(cmntUser['photo']);
      }
    }

    return data;
  }
  async create(post: CreatePostRequest) {
    const postCreated = this.postRepository.create({ title: post.title, content: post.content });
    return await this.postRepository.save(postCreated);
  }

  async getOne(id: number) {
    return this.postRepository.findOneBy({ id: id });
  }

  async setPhoto(language: string, post: Post, photo: Express.Multer.File) {
    if (post.photo) {
      this.attachmentService.deleteImage(post.photo);
    }
    console.log(photo);
    post.photo = await this.attachmentService.createPostImage(post.id, photo);

    if (!post.photo) {
      throw new HttpException(
        globalMessages[language].error.modificationFailed,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    await this.postRepository.update(post.id, { photo: post.photo });
    return post.photo;
  }
  async likePost(language: Language, postId: number, user: User) {
    return await this.likeService.create(language, postId, user);
  }
  async unlikePost(id: number, userId: number) {
    return await this.likeService.delete(id, userId);
  }

  async deleteComment(language: Language, userId: number, commentDeleteReq: DeleteCommentRequest) {
    return await this.commentService.delete(language, userId, commentDeleteReq);
  }

  async createComment(createCommentRequest: CreateCommentRequest, user: User) {
    const post = await this.getOne(createCommentRequest.postId);
    const content = createCommentRequest.content;
    return await this.commentService.create(content, post, user);
  }
  async updateComment(updateCommentReq: UpdateCommentRequest, user: User, language: Language) {
    const content = updateCommentReq.content;
    const commentId = updateCommentReq.commentId;
    return await this.commentService.update(content, commentId, user, language);
  }

  private isEditable(comment, user): boolean {
    const commentUser = comment['user'];
    return parseInt(commentUser['id']) === parseInt(user.id);
  }
}
