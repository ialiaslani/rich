import { IsNotEmpty, IsEmail } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
        
        @IsNotEmpty()
        @ApiProperty()
        name: string

        @IsNotEmpty()
        @IsEmail()
        @ApiProperty()
        email: string

        @IsNotEmpty()
        @ApiProperty()
        password: string
}