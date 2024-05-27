import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipTypeController } from './membership-type.controller';
import { MembershipType } from './membership-type.entity';
import { MembershipTypeService } from './membership-type.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipType])],
  controllers: [MembershipTypeController],
  providers: [MembershipTypeService]
})
export class MembershipTypeModule {}
