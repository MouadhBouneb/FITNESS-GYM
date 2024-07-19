import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { PlanModule } from '../plan/plan.module';
import { ActivityService } from './activity.service';
import { ActivityController } from './acitvity.controller';
import { MembershipTypeModule } from '../membership-type/membership-type.module';

@Module({
  controllers: [ActivityController],
  imports: [TypeOrmModule.forFeature([Activity]), PlanModule, MembershipTypeModule],
  providers: [ActivityService],
  exports: [ActivityService]
})
export class ActivityModule {}
