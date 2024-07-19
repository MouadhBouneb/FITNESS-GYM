/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateMembershipRequest {
  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  membershipTypeId: number;
  
  @IsNumber()
  @ApiProperty({example: 1,required:true})
  membershipPriceId: number;
  
  
  @IsBoolean()
  enable?: boolean = false;
}
