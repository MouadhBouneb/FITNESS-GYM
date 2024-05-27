import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxeController } from './taxe.controller';
import { TaxeService } from './taxe.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Taxe } from './taxe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Taxe])],
  controllers: [TaxeController],
  providers: [TaxeService]
})
export class TaxeModule {}
