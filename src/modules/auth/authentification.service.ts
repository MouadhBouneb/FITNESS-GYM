/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserRequest } from '../../common/validators/user/request/create';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { globalMessages } from 'src/utils/global-messages';
import { Language } from 'src/common/validators/language';

@Injectable()
export class AuthentificationService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  public getCookieWithJwtToken(userId: number, role: string) {
    const payload: TokenPayload = { userId, role };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME'
    )}`;
  }


  public async register(language: string, registrationData: CreateUserRequest): Promise<Object> {
    const createdUser = await this.usersService.create(language, registrationData);
    createdUser.password = undefined;
    console.log(createdUser);
    const token = this.getCookieWithJwtToken(createdUser.id, createdUser.role);
    return { "user": createdUser, "token": token };
  }

  public async getAuthenticatedUser(
    language: string,
    login: string,
    hashedPassword: string
  ): Promise<User> {
    const user = await this.usersService.getByLogin(login);
    if (!user) {
      console.log('user');
      throw new HttpException(
        globalMessages[language].error.wrongCredentials,
        HttpStatus.BAD_REQUEST
      );
    }
    await this.verifyPassword(language, hashedPassword, user.password);
    user.password = undefined;
    return user;
  }
  private async verifyPassword(
    language: string,
    plainTextPassword: string,
    hashedPassword: string
  ) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      console.log('isPasswordMatching');
      throw new HttpException(
        globalMessages[language].error.wrongCredentials,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
  public async verifyToken(
    language: string,
    cookie: string
  ) {
    
    const token = cookie?.[0].split(';')[0].split('=')[1];
    const decodedUser = this.jwtService.decode(token)
    console.log(decodedUser);
    
    if (!decodedUser){
      throw new HttpException(
        globalMessages[language].error.unableToVerifyToken,
        HttpStatus.BAD_REQUEST
      );
    }
    const user = await this.usersService.GetOne(decodedUser.id);
    if (!user) {
      throw new HttpException(
        globalMessages[language].error.unableToVerifyToken,
        HttpStatus.BAD_REQUEST
      );
    }
    return user;
  }

}
