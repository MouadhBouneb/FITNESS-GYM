/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import {  } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoce.entity';
import { InvoiceService } from './invoice.service';
import { TaxeService } from '../taxe/taxe.service';
import { TaxeModule } from '../taxe/taxe.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice]),TaxeModule],
  controllers: [],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
