import { Body, Controller, Post, NotFoundException, BadRequestException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LoginDto } from './Dtos/login.dto';
import { RegisterDto } from './Dtos/register.dto';
import * as bcrypt from "bcrypt"
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { HasPermission } from '../permission/permission.decorator';
import { User } from '../user/models/user.entity';

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
                let user: User = await this.userService.findOne({ email })

                if (!user) {
                        throw new NotFoundException("User Not Fount")
                }

                const blocked = await this.authService.getCache("user_" + user.id)

                if (blocked.value) {
                        throw new BadRequestException(`Sorry ${blocked.value} Please Try Again After ${blocked.ttl} Seconds`)
                }


                if (! await bcrypt.compare(password, user.password)) {
                        const numberOfTries = +(await this.authService.getCache("number_of_tries_" + user.id)).value || 0

                        if (numberOfTries >= 3) {
                                await this.authService.deleteCache("number_of_tries_" + user.id)
                                await this.authService.setCache("user_" + user.id, user.name)
                                await this.userService.update(user.id, { status: "BLOCKED" })
                        }

                        await this.authService.setCache("number_of_tries_" + user.id, `${numberOfTries + 1}`)

                        throw new BadRequestException("Invalid Password!")
                }


                const token = await this.jwtService.signAsync({ id: user.id }, { secret: process.env.TOKEN_SECRET })


                if (user.status === "BLOCKED") {
                        await this.userService.update(user.id, { status: "ACTIVE" })
                        user = await this.userService.findOne({ email })
                }

                return { user, token }

        }
}
