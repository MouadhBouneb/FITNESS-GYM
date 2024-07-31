import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { MembershipTypeService } from './membership-type.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateMembershipTypeRequest } from 'src/common/validators/membership-type/request/create';
import { UpdateMembershipTypeRequest } from 'src/common/validators/membership-type/request/update';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptionsMembershipTypePhoto } from 'src/utils/photo-upload-config';
import { Language } from 'src/common/validators/language';
@ApiTags('membership-types')
@Controller('membership-types')
export class MembershipTypeController {
  constructor(private membershipTypeService: MembershipTypeService) {}

  @Roles('ROOT', 'ADMIN')
  @Post()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateMembershipTypeRequest,
    description: 'Json structure for taxe object'
  })
  @UseInterceptors(FileInterceptor('file', multerOptionsMembershipTypePhoto))
  async create(
    @Body() CreateMembershipTypeRequest: CreateMembershipTypeRequest,
    @UploadedFile() file?: Express.Multer.File,
    @Headers() headers?: any
  ) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    const memberShipType = await this.membershipTypeService.create(CreateMembershipTypeRequest);
    const returnMemberShip: any = memberShipType;
    console.log(memberShipType);

    returnMemberShip['photo'] = await this.membershipTypeService.setPhoto(
      language,
      memberShipType,
      file
    );
    return returnMemberShip;
  }
  @Roles('ROOT', 'ADMIN')
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: UpdateMembershipTypeRequest,
    description: 'Json structure for taxe object'
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'integer',
    example: 1
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateMembershipTypeRequest: UpdateMembershipTypeRequest
  ) {
    console.log('id', id);

    return this.membershipTypeService.update(id, UpdateMembershipTypeRequest);
  }
  @Get('')
  findAll(@Headers() headers?: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return this.membershipTypeService.findAll(language);
  }
  @Get(':id/photo')
  getPhoto(@Param('id', ParseIntPipe) id: number, @Headers() headers?: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return this.membershipTypeService.getPhoto(id);
  }

  @Get('without-images')
  getMemebershipTypesWithoutImages(@Headers() headers: any) {
    let language: Language = Language[headers?.['accept-language']];
    if (!language) {
      language = Language.en;
    }
    return this.membershipTypeService.findAllWithoutImages(language);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.membershipTypeService.findById(id);
  }

  @Roles('ADMIN', 'ROOT')
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  deleteById(@Param('id', ParseIntPipe) id: number) {
    console.log(id);

    return this.membershipTypeService.deleteById(id);
  }

  @Get(':id/prices')
  async getMembershipPrices(@Param('id', ParseIntPipe) id: number) {
    const membership = await this.membershipTypeService.getMembershipPrices(id);
    return membership.membershipPrices;
  }
}
