import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './models/register.dto';

@Controller()
export class AuthController {
        constructor (private userService: UserService) { }

        @Post("register")
        register(@Body() data: RegisterDto) {
                return this.userService.create(data)
        }
}
