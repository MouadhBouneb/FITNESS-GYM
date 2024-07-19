import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Membership } from './membership.entity';
import { AuthentificationModule } from '../auth/authentification.module';
import { MembershipPriceModule } from '../memebership-price/membership-price.module';
import { MemebershipExtensionModule } from '../memebership-extension/memebership-extension.module';
import { MembershipExtension } from '../memebership-extension/membership-extension.entity';
import { JwtModule } from '@nestjs/jwt';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [TypeOrmModule.forFeature([Membership]),InvoiceModule,AuthentificationModule,MemebershipExtensionModule,MembershipPriceModule],
  controllers: [MembershipController],
  providers: [MembershipService],
})
export class MembershipModule {}
