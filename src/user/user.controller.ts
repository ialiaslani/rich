import { ClassSerializerInterceptor, Controller, Get, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Router } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './model/user.entity';
import { UserService } from './user.service';

@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {

        constructor (private userService: UserService) { }

        @Get("search")
        async all(): Promise<User[]> {
                return await this.userService.all()
        }


        @Get("/root")
        root(@Request() req: any) {
                const router = req.app._router as Router;
                const routes = router.stack
                        .map(layer => {
                                if (layer.route && !layer.route?.path.includes("docs")) {
                                        const path = layer.route?.path;
                                        const method = layer.route?.stack[0].method;
                                        return { method, path }
                                }
                        })
                        .filter(item => item !== undefined)
                return {
                        routes
                }
        }
}


