import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AttachementModule } from '../attachement/attachement.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),JwtModule,AttachementModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],

})
export class UserModule {}
