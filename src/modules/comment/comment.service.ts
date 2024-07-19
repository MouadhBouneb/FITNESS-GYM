import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/common/validators/language';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { User } from '../user/user.entity';
import { DeleteCommentRequest } from 'src/common/validators/comment/request/delete';
import { globalMessages } from 'src/utils/global-messages';
import { Post } from '../post/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>
  ) {}
  async create(content: string, post: Post, user: User): Promise<Comment> {
    const newComment = this.commentRepository.create({
      post: post,
      user: user,
      comment: content
    });
    return this.commentRepository.save(newComment);
  }
  async update(content: string, commentId: number, user: User, language: Language) {
    const comment = await this.commentRepository.findOne({
      relations: { user: true },
      where: {
        id: commentId,
        user: { id: user.id }
      }
    });
    if (!comment) {
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    return this.commentRepository.update({ id: commentId }, { comment: content });
  }
  async delete(language: Language, userId: number, deleteCommentReq: DeleteCommentRequest) {
    const comment = await this.commentRepository.findOne({
      relations: { user: true },
      where: {
        id: deleteCommentReq.commentId,
        user: { id: userId }
      }
    });
    if (!comment) {
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    return this.commentRepository.delete(comment.id);
  }
}
