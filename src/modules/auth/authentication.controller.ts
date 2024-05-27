/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { Body, Req, Controller, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import RequestWithUser from './strategy/requestWithUser.interface';
import { Request, Response } from 'express';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import { User } from '../user/user.entity';
import { RegisterRequest } from '../../common/validators/auth/request/register';
import { LoginRequest } from '../../common/validators/auth/request/login';
import { globalMessages } from 'src/utils/global-messages';
import { ApiBody, ApiTags } from '@nestjs/swagger';
@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthentificationService) {}

  @Post('register')
  @ApiBody({
    type: RegisterRequest,
    description: 'Json structure for auth object'
  })
  async register(
    @Req() request: Request,
    @Body() registrationData: RegisterRequest
  ): Promise<User> {
    return this.authenticationService.register(request['lang'], registrationData);
  }

  @UsePipes(new ValidationPipe())
  @Post('log-in')
  @ApiBody({
    type: LoginRequest,
    description: 'Json structure for auth object'
  })
  async logIn(@Req() request: Request, @Body() login: LoginRequest, @Res() response: Response) {
    const user: User = await this.authenticationService.getAuthenticatedUser(
      request['lang'],
      login.login,
      login.password
    );
    if (!user.enable) {
      throw new HttpException(
        globalMessages[request['lang']].error.accountLocked,
        HttpStatus.UNAUTHORIZED
      );
    }
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id, user.role);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
