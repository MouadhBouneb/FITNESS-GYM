/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { MembershipPriceService } from './membership-price.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateMembershipRequest } from 'src/common/validators/membership-price/create';
import { UpdateMembershipPriceRequest } from 'src/common/validators/membership-price/update';

@ApiTags('membership-prices')
@Controller('membership-prices')
export class MembershipPriceController {
  constructor(private membershipPriceService: MembershipPriceService) {}

  @Roles('ROOT', 'ADMIN')
  @Post()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateMembershipRequest,
    description: 'Json structure for taxe object'
  })
  create(@Body() CreateMembershipRequest: CreateMembershipRequest) {
    return this.membershipPriceService.create(CreateMembershipRequest);
  }
  @Roles('ROOT', 'ADMIN')
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: UpdateMembershipPriceRequest,
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
    @Body() updateMembershipPriceRequest: UpdateMembershipPriceRequest
  ) {
    console.log('id', id);

    return this.membershipPriceService.update(id, updateMembershipPriceRequest);
  }
  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  findAll() {
    return this.membershipPriceService.findAll();
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
    return this.membershipPriceService.findById(id);
  }
  @Roles('ROOT', 'ADMIN')
  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  deleteById(@Param('id', ParseIntPipe) id: number) {
    return this.membershipPriceService.deleteById(id);
  }
}
