/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from '../../common/validators/user/request/create';
import { UpdateUserRequest } from '../../common/validators/user/request/update';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleGuard } from '../auth/role.guard';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { globalMessages } from 'src/utils/global-messages';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsUserPhoto } from 'src/utils/photo-upload-config';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) { }

  @Roles('ROOT', 'ADMIN')
  @Post()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateUserRequest,
    description: 'Json structure for user object'
  })
  createUser(@Req() request: Request, @Body() userDto: CreateUserRequest) {
    return this.userService.create(request['lang'], userDto);
  }

  @Roles('ROOT', 'ADMIN')
  @Get()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  getUsers() {
    return this.userService.GetAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  getUserByID(@Param('id', ParseIntPipe) id: number) {
    return this.userService.GetOne(id);
  }
  @Get(':email')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'email',
    required: true,
    example: 'example@example.com'
  })
  getUserByEmail(@Param('email') email: string) {
    return this.userService.getByEmail(email);
  }

  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerOptionsUserPhoto))
  @Post(':id/upload-photo')
  async uploadPhoto(@UploadedFile() file: Express.Multer.File, @Headers() headers:Object): Promise<string> {
    if (!headers['accept-language']) {
      throw new HttpException(
        globalMessages['fr'].error.missingLanguage,
        HttpStatus.UNAUTHORIZED
      );
    }
    const token = headers['set-cookie']
    const language = headers['accept-language']
    const user = await this.userService.DecodeAndGet(language,token)
    if (!user)
      {
        throw new HttpException(
          globalMessages[language].error.unauthorized,
          HttpStatus.UNAUTHORIZED
        )
      }
    const base64Photo = this.userService.setPhoto(language, user, file)
    return base64Photo
  }
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: UpdateUserRequest,
    description: 'Json structure for user object'
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  updateUser(
    @Req() request: Request,
    @Body() userDto: UpdateUserRequest,
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.userService.update(request['lang'], id, userDto);
  }
  @Roles('ROOT', 'ADMIN')
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  deleteUserByID(@Req() request: Request, @Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(request['lang'], id);
  }

}
