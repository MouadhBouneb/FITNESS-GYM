import {  IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateActivityRequest {

    @IsNumber()
    id: number
    @MaxLength(6)
    @IsString()
    @Matches('[0-2][0-9]:[0-5][0-9]')
    @IsOptional()
    hour: string
    @MaxLength(6)
    @IsString()
    @Matches('[0-2][0-9]:[0-5][0-9]')
    @IsOptional()
    duration: string
    @MaxLength(50)
    @MinLength(3)
    @IsString()
    @IsOptional()
    title: string
    @MaxLength(11)
    @MinLength(9)
    @Matches('[0-9]4-[0-1][0-9]-[0-3][0-9]')
    @IsOptional()
    date:string

    @IsOptional()
    @IsNumber()
    membershipTypeId:number
}