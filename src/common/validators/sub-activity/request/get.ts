import { IsNumber } from 'class-validator';

export class GetSubActivitiesRequest {
  @IsNumber()
  activityId: number;
}
