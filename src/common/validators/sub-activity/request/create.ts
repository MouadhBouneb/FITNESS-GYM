import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSubActivityRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(6)
  duration: string;

  @IsNumber()
  activityId: number;
}
