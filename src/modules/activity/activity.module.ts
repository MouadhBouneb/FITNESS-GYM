import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './activity.entity';
import { PlanModule } from '../plan/plan.module';
import { ActivityService } from './activity.service';
import { ActivityController } from './acitvity.controller';
import { MembershipTypeModule } from '../membership-type/membership-type.module';
import { AuthentificationModule } from '../auth/authentification.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ActivityController],
  imports: [
    TypeOrmModule.forFeature([Activity]),
    PlanModule,
    MembershipTypeModule,
    AuthentificationModule,
    UserModule
  ],
  providers: [ActivityService],
  exports: [ActivityService]
})
export class ActivityModule {}
