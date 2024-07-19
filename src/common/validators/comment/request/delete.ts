import { IsNumber } from 'class-validator';

export class DeleteCommentRequest {
  @IsNumber()
  commentId: number;
}
