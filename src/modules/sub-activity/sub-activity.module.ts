import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubActivity } from './sub-activity.entity';
import { ActivityModule } from '../activity/activity.module';
import { SubActivityController } from './sub-activity.controller';
import { SubActivityService } from './sub-activity.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubActivity]), ActivityModule],
  providers: [SubActivityService],
  controllers: [SubActivityController]
})
export class SubActivityModule {}
