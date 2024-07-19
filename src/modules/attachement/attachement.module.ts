/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Attachement } from './attachement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachementService } from './attachement.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attachement])],
  controllers: [],
  providers: [AttachementService],
  exports: [AttachementService],
})
export class AttachementModule {}
