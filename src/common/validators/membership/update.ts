/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateMembershipRequest {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    required: true
  })
  membershipTypeId: number;
  @IsOptional()
  enable?: boolean = false;
}
