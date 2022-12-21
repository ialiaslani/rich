import { IsNotEmpty, IsEmail } from "class-validator"


export class LoginDto {

        @IsNotEmpty()
        @IsEmail()
        email: string

        @IsNotEmpty()
        password: string

}