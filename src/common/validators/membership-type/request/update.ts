/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateMembershipTypeRequest {
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'example',
    required: false
  })
  nameFr: string;
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'example',
    required: false
  })
  nameEn: string;
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'example',
    required: false
  })
  nameAr: string;
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  enable: boolean = true;
}
