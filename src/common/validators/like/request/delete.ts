import { IsNumber } from 'class-validator';

export class deleteLikeRequest {
  @IsNumber()
  likeId: number;
}
