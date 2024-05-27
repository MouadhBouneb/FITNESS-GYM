/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaxeRequest {
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @ApiProperty({
    example: 'TAX001',
    required: true
  })
  code: string;
  @IsNumber()
  @ApiProperty({
    example: 7,
    required: true
  })
  value: number;
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  @IsOptional()
  enable: boolean = true;
}
