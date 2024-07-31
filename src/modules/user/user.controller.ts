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
import { JwtService } from '@nestjs/jwt';
import { Language } from 'src/common/validators/language';
import { AttachementService } from '../attachement/attachement.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly attachmentService: AttachementService,
    private readonly jwtService: JwtService
  ) {}

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

  @Get('/memberships')
  @UseGuards(JwtAuthenticationGuard)
  async getMembership(@Req() request: Request, @Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.jwtService.decode(token);
    if (!decodedUser) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }

    return this.userService.getMemberships(decodedUser.userId,language);
  }

  // @Post('join/:id')
  // @UseGuards(JwtAuthenticationGuard)
  // async joinActivity(
  //   @Req() request: Request,
  //   @Headers() headers: any,
  //   @Param('id', new ParseIntPipe()) activityId: number
  // ) {
  //   let language: Language = Language[headers?.['accept-language']];
  //   if (!language) {
  //     language = Language.en;
  //   }
  //   const token = request.cookies?.Authentication;
  //   const decodedUser = await this.jwtService.decode(token);
  //   if (!decodedUser) {
  //     throw new HttpException(
  //       globalMessages[request['lang']].error.unauthorized,
  //       HttpStatus.UNAUTHORIZED
  //     );
  //   }
    
  //   return this.userService.joinActivity(language, activityId, decodedUser.userId);
  // }

  @Roles('ROOT', 'ADMIN')
  @Get()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  getUsers() {
    return this.userService.GetAll();
  }
  @Get('statistics')
  @UseGuards(JwtAuthenticationGuard)
  async getStatistics(@Req() request: Request, @Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.jwtService.decode(token);

    if (!decodedUser) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.userService.getStatistics(decodedUser.userId, language);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  getUserByID(@Param('id', new ParseIntPipe()) id: number) {
    return this.userService.GetOne(id);
  }

  @Put()
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({ type: UpdateUserRequest, description: 'Json structure for user object' })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  async updateUser(
    @Req() request: Request,
    @Body() userDto: UpdateUserRequest,
    @Headers() headers: any
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.jwtService.decode(token);
    if (!decodedUser) {
      throw new HttpException(
        globalMessages[request['lang']].error.unauthorized,
        HttpStatus.UNAUTHORIZED
      );
    }
    return this.userService.update(language, decodedUser.userId, userDto);
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
  //maysa
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file', multerOptionsUserPhoto))
  @Post('photo')
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Headers() headers: any,
    @Req() request: Request,  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const token = request.cookies?.Authentication;
    const decodedUser = await this.jwtService.decode(token);
    const user = await this.userService.GetOneWithPhoto(decodedUser.userId);
    if (!user) {
      this.attachmentService.deleteImage(file);
      throw new HttpException(globalMessages[language].error.unauthorized, HttpStatus.UNAUTHORIZED);
    }
    const base64Photo = this.userService.setPhoto(language, user, file);
    return base64Photo;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id/photo')
  async getPhoto(@Headers() headers: any, @Param('id', new ParseIntPipe()) id: number) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return await this.userService.getPhoto(language, id);
  }

  @Roles('ROOT', 'ADMIN')
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  deleteUserByID(@Req() request: Request, @Param('id', new ParseIntPipe()) id: number) {
    return this.userService.delete(request['lang'], id);
  }
}
