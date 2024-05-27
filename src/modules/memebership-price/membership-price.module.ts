import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipPriceController } from './membership-price.controller';
import { MembershipPriceService } from './membership-price.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MembershipType } from '../membership-type/membership-type.entity';
import { MembershipPrice } from './membership-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipType, MembershipPrice])],
  controllers: [MembershipPriceController],
  providers: [MembershipPriceService]
})
export class MembershipPriceModule {}
