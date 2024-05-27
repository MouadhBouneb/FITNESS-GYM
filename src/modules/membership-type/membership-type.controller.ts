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
import { MembershipTypeService } from './membership-type.service';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '../auth/jwt-authentication.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateMembershipTypeRequest } from 'src/common/validators/membership-type/request/create';
import { UpdateMembershipTypeRequest } from 'src/common/validators/membership-type/request/update';
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
  create(@Body() CreateMembershipTypeRequest: CreateMembershipTypeRequest) {
    return this.membershipTypeService.create(CreateMembershipTypeRequest);
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
  @UseGuards(JwtAuthenticationGuard)
  @UsePipes(new ValidationPipe())
  findAll() {
    return this.membershipTypeService.findAll();
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
    return this.membershipTypeService.deleteById(id);
  }
}
