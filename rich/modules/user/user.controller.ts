import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UserSearchDto } from './Dtos/user.search.dto';
import { UserService } from './user.service';
import { UserUpdateParamsDto, UserUpdatePayloadDto } from './Dtos/user.update.dto';
import { diskStorage } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { editFileName, imageFileFilter } from '../file/file.utils';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('search')
  async search(@Query() payload: UserSearchDto, @Response() res) {
    const data = await this.userService.search({
      ...payload,
      roles: ':relation',
      ...(payload.getExcel && { sheetName: 'users' }),
    });

    if (payload.getExcel) {
      res
        .header('Content-type', 'application/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        .header('Content-Disposition', 'Content-Disposition: attachment; filename="users.xls"')
        .send(data);
    }

    if ('data' in data) data.data = data.data.map(({ password, ...d }) => d);

    res.send(data);
  }

  @Put('update/:id')
  async update(@Param() param: UserUpdateParamsDto, @Body() payload: UserUpdatePayloadDto) {
    return await this.userService.update(param, payload);
  }

  @Post('upload_avatar/:id')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './upload',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
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
  async upload(@Param() { id }: UserUpdateParamsDto, @UploadedFile() avatar) {
    const fileReponse = {
      originalname: avatar.originalname,
      filename: avatar.filename,
    };

    await this.userService.saveAvatar(id, fileReponse.filename);

    return fileReponse;
  }

  @Get('get_avatar/:id')
  async getAvatar(@Param() { id }: UserUpdateParamsDto, @Res() res) {
    const user = await this.userService.findOne({ id });
    return res.sendFile(user.image, { root: './upload' });
  }
}
