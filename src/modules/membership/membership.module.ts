import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Membership } from './membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Membership])],
  controllers: [MembershipController],
  providers: [MembershipService]
})
export class MembershipModule {}
