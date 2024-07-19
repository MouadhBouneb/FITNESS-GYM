import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipTypeController } from './membership-type.controller';
import { MembershipType } from './membership-type.entity';
import { MembershipTypeService } from './membership-type.service';
import { Module } from '@nestjs/common';
import { AttachementModule } from '../attachement/attachement.module';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipType]), AttachementModule],
  controllers: [MembershipTypeController],
  providers: [MembershipTypeService],
  exports: [MembershipTypeService]
})
export class MembershipTypeModule {}
