/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { JwtModule } from '@nestjs/jwt';
import { AttachementModule } from '../attachement/attachement.module';
import { AuthentificationModule } from '../auth/authentification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]),JwtModule,AttachementModule,AuthentificationModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
