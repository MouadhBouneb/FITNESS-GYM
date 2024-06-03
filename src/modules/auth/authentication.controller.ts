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

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthentificationService) { }

  @Post('register')
  @ApiBody({
    type: RegisterRequest,
    description: 'Json structure for auth object'
  })
  async register(
    @Headers() headers:Object,
    @Body() registrationData: RegisterRequest, @Res() response: Response
  ): Promise<Response> {
    if (!headers['accept-language']) {
      throw new HttpException(
        globalMessages['fr'].error.missingLanguage,
        HttpStatus.UNAUTHORIZED
      );
    }
    const language = headers['accept-language']
    const register = await this.authenticationService.register(language, registrationData)
    response.setHeader('set-cookie', register['token']);
    return response.send(register['user']);
  }

  @UsePipes(new ValidationPipe())
  @Post('log-in')
  @ApiBody({
    type: LoginRequest,
    description: 'Json structure for auth object'
  })
  async logIn(@Headers() headers:Object, @Body() login: LoginRequest, @Res() response: Response): Promise<Response> {

    if (!headers['accept-language']) {
      throw new HttpException(
        globalMessages['fr'].error.missingLanguage,
        HttpStatus.UNAUTHORIZED
      );
    }
    const language = headers['accept-language']
    if (!login.login || !login.password) {
      throw new HttpException(
        globalMessages[language].error.miss,
        HttpStatus.UNAUTHORIZED
      );
    }
    console.log(login);

    const user: User = await this.authenticationService.getAuthenticatedUser(
      language,
      login.login,
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
    user.password = undefined;

    return response.send(user).status(200);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('set-cookie', this.authenticationService.getCookieForLogOut());
    return response.sendStatus(200);
  }
  
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async authenticate(@Headers() headers:Object, @Res() response: Response) {
    if (!headers['accept-language']) {
      throw new HttpException(
        globalMessages['fr'].error.missingLanguage,
        HttpStatus.UNAUTHORIZED
      );
    }
    const language = headers['accept-language']

    if (!headers['set-cookie']) {
      throw new HttpException(
        globalMessages[language].error.verificationFailed,
        HttpStatus.UNAUTHORIZED
      );
    }
    const cookie = headers['set-cookie'];
    console.log(cookie);

    const user: User = await this.authenticationService.verifyToken(language, cookie);
    if (!user) {
      throw new HttpException(
        globalMessages[language].error.verificationFailed,
        HttpStatus.UNAUTHORIZED
      );
    }
    user.password=null
    return response.send(user).status(200)
  }


}
