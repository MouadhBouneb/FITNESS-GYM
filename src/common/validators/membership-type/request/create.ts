/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMembershipTypeRequest {
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @ApiProperty({
    example: 'example',
    required: true
  })
  nameFr: string;
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @ApiProperty({
    example: 'example',
    required: true
  })
  nameEn: string;
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  @IsOptional()
  enable: boolean = true;
}
