import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { JwtModule } from '@nestjs/jwt';
import { PlanModule } from '../plan/plan.module';
import { ActivityService } from './activity.service';
import { ActivityController } from './acitvity.controller';

@Module({
    controllers:[ActivityController],
    imports:[TypeOrmModule.forFeature([Activity]),JwtModule,PlanModule],
    providers:[ActivityService]
})
export class ActivityModule {}
