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
import { TaxeService } from './taxe.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { CreateTaxeRequest } from '../../common/validators/taxe/request/create';
import { UpdateTaxeRequest } from '../../common/validators/taxe/request/update';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
@ApiTags('taxes')
@Controller('taxes')
export class TaxeController {
  constructor(private taxeService: TaxeService) {}

  @Roles('ROOT', 'ADMIN')
  @Post()
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: CreateTaxeRequest,
    description: 'Json structure for taxe object'
  })
  create(@Body() createTaxeRequest: CreateTaxeRequest) {
    return this.taxeService.create(createTaxeRequest);
  }
  @Roles('ROOT', 'ADMIN')
  @Put(':id')
  @UseGuards(JwtAuthenticationGuard, RoleGuard)
  @UsePipes(new ValidationPipe())
  @ApiBody({
    type: UpdateTaxeRequest,
    description: 'Json structure for taxe object'
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: 1
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTaxeRequest: UpdateTaxeRequest) {
    return this.taxeService.update(id, updateTaxeRequest);
  }
  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  findAll() {
    return this.taxeService.findAll();
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
    return this.taxeService.findById(id);
  }
  @Get('by-code/:code')
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  @ApiParam({
    name: 'code',
    required: true,
    type: String, // Specify the type as String
    example: 'TAX001'
  })
  findByCode(@Param('code') code: string) {
    return this.taxeService.findByCode(code);
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
    return this.taxeService.deleteById(id);
  }
}
