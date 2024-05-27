/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateMembershipRequest {
  @IsNumber()
  @ApiProperty({
    example: 1,
    required: true
  })
  membershipTypeId: number;

  @IsNumber()
  @ApiProperty({
    example: 1.5,
    required: true
  })
  userId: number;

  enable?: boolean = false;
}
