import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCommentRequest {
  @MaxLength(100)
  @MinLength(3)
  @IsString()
  content: string;
  @IsNumber()
  commentId: number;
}
