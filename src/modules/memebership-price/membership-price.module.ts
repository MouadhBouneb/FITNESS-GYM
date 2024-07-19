import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPriceController } from './membership-price.controller';
import { MembershipPriceService } from './membership-price.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MembershipType } from '../membership-type/membership-type.entity';
import { MembershipPrice } from './membership-price.entity';
import { MembershipTypeModule } from '../membership-type/membership-type.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPrice]),MembershipTypeModule],
  controllers: [MembershipPriceController],
  providers: [MembershipPriceService],
  exports:[MembershipPriceService]
})
export class MembershipPriceModule {}
