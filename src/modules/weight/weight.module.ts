import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Weight } from './weight.entity';
import { WeightService } from './weight.service';

@Module({
  imports: [TypeOrmModule.forFeature([Weight])],
  controllers: [],
  providers: [WeightService],
  exports: [WeightService],

})
export class WeightModule {}
