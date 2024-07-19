/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMembershipPriceRequest {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    required: true
  })
  membershipTypeId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1.5,
    required: true
  })
  price: number;
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: '30 | 60 | 90 | 360 ',
    required: true
  })
  length: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 5,
    required: false
  })
  discount: number;
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  @IsOptional()
  enable: boolean = true;
}
