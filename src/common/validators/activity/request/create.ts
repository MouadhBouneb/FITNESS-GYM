import { IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateActivityRequest {
  @MaxLength(6)
  @IsString()
  @Matches('[0-2][0-9]:[0-5][0-9]')
  hour: string;

  @MaxLength(50)
  @MinLength(3)
  @IsString()
  title: string;
  @MaxLength(11)
  @MinLength(9)
  @Matches('[0-9]4-[0-1][0-9]-[0-3][0-9]')
  date: string;

  @IsNumber()
  membershipTypeId: number;
}
