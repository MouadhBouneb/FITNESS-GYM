import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from 'src/common/validators/language';
import { Repository } from 'typeorm';
import { Like } from './like.entity';
import { User } from '../user/user.entity';
import { globalMessages } from 'src/utils/global-messages';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ) {}
  async create(language: Language, postId: number, user: User): Promise<Like> {
    const existingLike = await this.likeRepository.findOne({
      relations: { post: true, user: true },
      where: { post: { id: postId }, user: { id: user.id } }
    });
    console.log(existingLike);

    if (existingLike) {
      throw new HttpException(globalMessages[language].error.alreadyLiked, HttpStatus.CONFLICT);
    }
    const like = this.likeRepository.create({ post: { id: postId }, user: user });
    return await this.likeRepository.save(like);
  }
  async delete(id: number, userId: number) {
    const like = await this.likeRepository.findOne({
      relations: { user: true },
      where: { id: id, user: { id: userId } }
    });
    if (!like) {
      throw new HttpException(globalMessages.en.error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    const delResult = await this.likeRepository.delete({ id: id });
    console.log(delResult);
    return delResult;
  }
  async findOneWithUser(postId: number, userId: number) {
    return await this.likeRepository.findOne({
      relations: { post: true, user: true },
      where: { post: { id: postId }, user: { id: userId } }
    });
  }
}
