/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from '../post/post.module';
import { AuthentificationModule } from '../auth/authentification.module';
import { CommentController } from './comment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]),JwtModule,PostModule,AuthentificationModule],
  controllers: [CommentController],
  providers: [CommentService]
})
export class ModuleModule {}
