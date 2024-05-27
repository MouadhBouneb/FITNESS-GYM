/*
https://docs.nestjs.com/middleware#middleware
*/

import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Language, LanguageMiddlewareDto } from '../validators/language';
import { validate } from 'class-validator';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const lang = req.headers['accept-language']?.toString().toLowerCase() || 'fr';
    if (!Object.values(Language).includes(lang as Language)) {
      throw new HttpException('Invalid language', HttpStatus.BAD_REQUEST);
    }
    const langDto = new LanguageMiddlewareDto(lang as Language);
    const errors = await validate(langDto);
    if (errors.length > 0) {
      throw new HttpException('Invalid language', HttpStatus.BAD_REQUEST);
    }
    req['lang'] = langDto.lang;
    next();
  }
}
