import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @MinLength(1)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'mouadh',
    required: true
  })
  fullName: string;

  @MinLength(20)
  @MaxLength(150)
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    example: '..@gmail.com',
    required: false
  })
  email: string;

  @MinLength(3)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'USER | ADMIN',
    required: false
  })
  role: string;

  @MinLength(3)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'sousse',
    required: false
  })
  adresse: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'firstname.lastname',
    required: false
  })
  login: string;

  @MinLength(8)
  @MaxLength(15)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '99999999',
    required: false
  })
  phone: string;

  @IsOptional()
  @ApiProperty({
    example: '180',
    required: false
  })
  height: number;
  @IsOptional()
  @ApiProperty({
    example: '80',
    required: false
  })
  weight: number;
  @IsDate()
  @IsOptional()
  @ApiProperty({
    example: '10-10-1997',
    required: false
  })
  dateOfBirth: Date;
  @IsOptional()
  @ApiProperty({
    example: 'true|false',
    required: false
  })
  enable: boolean;
}
