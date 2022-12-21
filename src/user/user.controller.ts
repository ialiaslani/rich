import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserSearchDto } from './models/user.search.dto';
import { UserService } from './user.service';

@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController {

        constructor (private userService: UserService) { }

        @Get("search")
        async search(@Query() payload: UserSearchDto) {
                return await this.userService.search(payload)
        }
}


