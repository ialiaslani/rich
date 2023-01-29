import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleCreateDto } from './Dtos/role.create.dto';
import { RoleDeleteDto } from './Dtos/role.delete.dto';
import { RoleUpdatePayloadDto, RoleUpdateParamsDto } from './Dtos/role.update.dto';
import { RoleShowDto } from './Dtos/role.show.dto';
import { RoleSearchDto } from './Dtos/role.search.dto';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get('search')
  async search(@Query() payload: RoleSearchDto) {
    return await this.roleService.search(payload);
  }

  @Get('show/:id')
  async show(@Query() payload: RoleShowDto) {
    return await this.roleService.findOne(payload);
  }

  @Post('create')
  async create(@Body() payload: RoleCreateDto) {
    return await this.roleService.create(payload);
  }

  @Put('update/:id')
  async update(@Param() param: RoleUpdateParamsDto, @Body() payload: RoleUpdatePayloadDto) {
    return await this.roleService.update(param, payload);
  }

  @Delete('delete/:id')
  async delete(@Param() payload: RoleDeleteDto) {
    return await this.roleService.delete(payload);
  }
}
