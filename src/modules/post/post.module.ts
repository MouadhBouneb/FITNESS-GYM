/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { AttachementModule } from '../attachement/attachement.module';
import { AuthentificationModule } from '../auth/authentification.module';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    LikeModule,
    AttachementModule,
    CommentModule,
    AuthentificationModule
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
