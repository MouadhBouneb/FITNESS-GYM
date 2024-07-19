/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
