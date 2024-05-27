/* eslint-disable prettier/prettier */

import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthentificationService } from '../authentification.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthentificationService) {
    super({
      usernameField: 'email'
    });
  }
  async validate(language: string, email: string, password: string): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(language, email, password);
  }
}
