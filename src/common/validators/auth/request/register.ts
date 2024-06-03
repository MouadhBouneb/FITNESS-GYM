import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterRequest {
  @MinLength(3)
  @MaxLength(50)
  @IsString()
  @ApiProperty({
    example: 'mouadh',
    required: true
  })
  fullName: string;

  @MinLength(8)
  @MaxLength(150)
  @IsEmail()
  @ApiProperty({
    example: '..@gmail.com',
    required: true
  })
  email: string;

  @MinLength(3)
  @MaxLength(20)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'USER | ADMIN',
    required: false
  })
  role: string = 'USER';

  @MinLength(3)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'msaken',
    required: false
  })
  adresse: string;

  @IsString()
  @ApiProperty({
    example: 'firstname.lastname',
    required: true
  })
  login: string;

  @MinLength(8)
  @MaxLength(15)
  @IsString()
  @ApiProperty({
    example: '99999999',
    required: true
  })
  phone: string;

  @MinLength(8)
  @ApiProperty({
    example: '********',
    required: true
  })
  password: string;
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
  @IsOptional()
  @IsDate()
  @ApiProperty({
    example: '10-10-1997',
    required: false
  })
  dateOfBirth: Date;
}
