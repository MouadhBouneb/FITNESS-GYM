import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as sharp from 'sharp';

@Injectable()
export class ImageResizeMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.file) {
      console.log(req.file);

      return next();
    }
    const imagePath = req.file.path;
    const resizedImagePath = `${imagePath}-resized`;

    try {
      await sharp(imagePath).resize(1920, 1080).toFile(resizedImagePath);
      req.file.path = resizedImagePath;
      next();
    } catch (error) {
      next(error);
    }
  }
}
