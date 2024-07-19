/* eslint-disable prettier/prettier */
import { Headers, HttpException, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
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
import { Language } from 'src/common/validators/language';

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
    @Headers() headers: any,
    @Body() registrationData: RegisterRequest,
    @Res() response: Response
  ): Promise<Response> {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const register = await this.authenticationService.register(language, registrationData);
    response.setHeader('set-cookie', register['token']);
    return response.send(register['user']);
  }

  @UsePipes(new ValidationPipe())
  @Post('log-in')
  @ApiBody({
    type: LoginRequest,
    description: 'Json structure for auth object'
  })
  async logIn(
    @Headers() headers: any,
    @Body() login: LoginRequest,
    @Res() response: Response
  ): Promise<Response> {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const user: User = await this.authenticationService.getAuthenticatedUser(
      language,
      login.login.toLowerCase(),
      login.password
    );

    if (!user.enable) {
      throw new HttpException(
        globalMessages[language].error.accountLocked,
        HttpStatus.UNAUTHORIZED
      );
    }
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id, user.role);
    response.setHeader('set-cookie', cookie);

    return response.send(user).status(200);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('set-cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('')
  async authenticate(@Headers() headers: any, @Req() request: Request, @Res() response: Response) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }

    const cookie = request?.cookies?.Authentication;
    const user: User = await this.authenticationService.verifyToken(language, cookie);
    if (!user) {
      throw new HttpException(
        globalMessages[language].error.unableToVerifyToken,
        HttpStatus.UNAUTHORIZED
      );
    }
    user.password = null;
    return response.send(user).status(200);
  }
}
