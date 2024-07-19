import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator';

export class CreatePostRequest {
  @ApiProperty({
    example: 'title',
    description: 'Post Title',
    required: false
  })
  @MinLength(3)
  @MaxLength(10)
  @IsString()
  @IsOptional()
  title: string;
  @ApiProperty({
    example: 'post content',
    description: 'Post Content',
    required: true
  })
  @MinLength(3)
  @MaxLength(300)
  @IsString()
  content: string;
}
