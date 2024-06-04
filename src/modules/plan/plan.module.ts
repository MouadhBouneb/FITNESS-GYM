import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './plan.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';

@Module({
    imports:[TypeOrmModule.forFeature([Plan]),JwtModule],
    controllers:[PlanController],
    providers:[PlanService],
    exports:[PlanService]

})
export class PlanModule {}
