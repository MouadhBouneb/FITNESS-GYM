import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AttachementModule } from '../attachement/attachement.module';

import { JwtModule } from '@nestjs/jwt';
import { WeightModule } from '../weight/weight.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AttachementModule, JwtModule, WeightModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
