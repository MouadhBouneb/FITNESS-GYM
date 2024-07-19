/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipExtension } from './membership-extension.entity';
import { MembershipExtensionService } from './membership-extension.service';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipExtension])],
  controllers: [],
  providers: [MembershipExtensionService],
  exports: [MembershipExtensionService],
})
export class MemebershipExtensionModule {}
