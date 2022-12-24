import { Body, Controller, Post, NotFoundException, BadRequestException, Res, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './Dtos/login.dto';
import { RegisterDto } from './Dtos/register.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { HasPermission } from 'src/permission/permission.decorator';
import { AuthService } from './auth.service';
import { User } from 'src/user/models/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller()
@ApiTags('auth')
export class AuthController {
        constructor (
                private userService: UserService,
                private authService: AuthService,
                private jwtService: JwtService
        ) { }

        @HasPermission("public")
        @Post("register")
        register(@Body() data: RegisterDto) {
                return this.userService.create(data)
        }

        @HasPermission("public")
        @Post("login")
        async login(@Body() { email, password }: LoginDto) {
                const user: User = await this.userService.findOne({ email })

                const blocked = await this.authService.getCache("user_" + user.id)

                if (blocked.name) {
                        throw new BadRequestException(`Sorry ${blocked.name} Please Try Again After ${blocked.ttl} Seconds`)
                }


                if (!user) {
                        throw new NotFoundException("User Not Fount")
                }


                if (! await bcrypt.compare(password, user.password)) {
                        await this.authService.setCache("user_" + user.id, user.name)
                        throw new BadRequestException("Invalid Password!")
                }


                const token = await this.jwtService.signAsync({ id: user.id }, { secret: "secretKey" })

                console.log('====================================');
                console.log(await this.authService.getAllData());
                console.log('====================================');

                return { user, token }

        }
}
