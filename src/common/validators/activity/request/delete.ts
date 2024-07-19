import { IsNumber } from 'class-validator';

export class DeleteActivityRequest {
  @IsNumber()
  id: number;
}
