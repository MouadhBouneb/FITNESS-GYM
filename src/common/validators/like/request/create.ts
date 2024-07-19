import { IsNumber } from "class-validator";

export class createLikeRequest{
    @IsNumber()
    postId: number
}