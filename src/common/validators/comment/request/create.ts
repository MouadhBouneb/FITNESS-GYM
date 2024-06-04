import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentRequest {
    @MaxLength(100)
    @MinLength(3)
    @IsString()
    content: string
    @IsNumber()
    postId: number
}
    
    
    