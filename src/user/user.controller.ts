import { ClassSerializerInterceptor, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
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

        @Post("avatar")
        @UseInterceptors(FileInterceptor("avatar"))
        @ApiConsumes('multipart/form-data')
        @ApiProperty()
        @ApiBody({
                schema: {
                        type: 'object',
                        properties: {
                                avatar: {
                                        type: 'string',
                                        format: 'binary',
                                },
                        },
                },
        })
        upload(@Param("id") id, @UploadedFile() avatar) {
                return this.userService.saveAvatar(id, avatar.buffer.toString())
        }
}


