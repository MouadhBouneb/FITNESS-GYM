/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateTaxeRequest {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 7,
    required: true
  })
  value: number;
  @IsOptional()
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  enable: boolean;
}
