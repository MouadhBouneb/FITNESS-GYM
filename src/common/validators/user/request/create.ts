import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({
    example: 'mouadh',
    description: 'Full name'
  })
  @MinLength(3)
  @MaxLength(30)
  @IsString()
  fullName: string;

  @ApiProperty({
    example: '..@gmail.com',
    description: 'Email address'
  })
  @MinLength(10)
  @MaxLength(90)
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'USER | ADMIN',
    description: 'User role'
  })
  @MinLength(3)
  @MaxLength(150)
  @IsString()
  role: string;

  @ApiProperty({
    example: 'msaken',
    description: 'Address',
    required: false
  })
  @MinLength(3)
  @MaxLength(150)
  @IsString()
  @IsOptional()
  adresse: string;

  @ApiProperty({
    example: 'firstname.lastname',
    description: 'Login'
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: '99999999',
    description: 'Phone number'
  })
  @MinLength(8)
  @MaxLength(15)
  @IsString()
  phone: string;

  @ApiProperty({
    example: '********',
    description: 'Password'
  })
  @MaxLength(40)
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: '180',
    description: 'Height',
    required: false
  })
  @IsOptional()
  @ApiProperty()
  height: number;

  @ApiProperty({
    example: '80',
    description: 'Weight',
    required: false
  })
  @IsOptional()
  @ApiProperty()
  weight: number;

  @ApiProperty({
    example: '2024-05-12',
    description: 'Date of birth (YYYY-MM-DD)',
    required: false
  })
  @IsDate()
  @IsOptional()
  dateOfBirth: Date;
}
