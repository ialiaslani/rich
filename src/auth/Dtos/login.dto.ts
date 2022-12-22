import { IsNotEmpty, IsEmail } from "class-validator"
import { ApiProperty } from '@nestjs/swagger';


export class LoginDto {

        @IsNotEmpty()
        @IsEmail()
        @ApiProperty()
        email: string

        @IsNotEmpty()
        @ApiProperty()
        password: string

}