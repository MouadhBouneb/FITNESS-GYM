/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  @ApiProperty({
    example: 'firstName.lastName',
    required: true
  })
  login: string;

  @MinLength(8)
  @ApiProperty({
    example: '*********',
    required: true
  })
  password: string;
}
