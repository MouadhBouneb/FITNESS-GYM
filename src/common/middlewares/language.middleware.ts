/*
https://docs.nestjs.com/middleware#middleware
*/

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.toString().toLowerCase() || 'fr';
    if (!lang) {
      throw new HttpException('Invalid language', HttpStatus.BAD_REQUEST);
    }
    req['lang'] = lang;
    next();
  }
}
