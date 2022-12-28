import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Put, Query, Response, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserSearchDto } from './Dtos/user.search.dto';
import { UserService } from './user.service';
import { UserUpdateParamsDto, UserUpdatePayloadDto } from './Dtos/user.update.dto';

@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController {

        constructor (private userService: UserService) { }

        @Get("search")
        async search(@Query() payload: UserSearchDto, @Response() res) {
                const data = await this.userService.search({ ...payload, roles: ":relation", sheetName: "users" })

                if (payload.getExcel) {
                        res.header(
                                "Content-type",
                                "application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                                .header("Content-Disposition", 'Content-Disposition: attachment; filename="users.xls"')
                                .send(data);
                }

                return data
        }

        @Put("update/:id")
        async update(@Param() param: UserUpdateParamsDto, @Body() payload: UserUpdatePayloadDto) {
                return await this.userService.update(param, payload)
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


