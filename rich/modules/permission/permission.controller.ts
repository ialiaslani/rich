import {
  Controller,
  Request,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Put,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionCreateDto } from './Dtos/permission.create.dto';
import { PermissionDeleteDto } from './Dtos/permission.delete.dto';
import { PermissionSearchDto } from './Dtos/permission.search.dto';
import { PermissionShowDto } from './Dtos/permission.show.dto';
import { PermissionUpdateParamsDto, PermissionUpdatePayloadDto } from './Dtos/permission.update.dto';
import { PermissionService } from './permission.service';
import { PermissionGenerateDto } from './Dtos/permission.generate.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Get('search')
  async search(@Query() payload: PermissionSearchDto) {
    return await this.permissionService.search(payload);
  }

  @Get('show/:id')
  async show(@Query() payload: PermissionShowDto) {
    return await this.permissionService.findOne(payload);
  }

  @Post('create')
  async create(@Body() payload: PermissionCreateDto) {
    return await this.permissionService.create(payload);
  }

  @Put('update/:id')
  async update(@Param() param: PermissionUpdateParamsDto, @Body() payload: PermissionUpdatePayloadDto) {
    return await this.permissionService.update(param, payload);
  }

  @Delete('delete/:id')
  async delete(@Param() payload: PermissionDeleteDto) {
    return await this.permissionService.delete(payload);
  }

  @Get('allRoutes')
  allRoutes(@Request() req) {
    return this.permissionService.allRoutes(req);
  }

  @Post('generate')
  async generate(@Body() payload: PermissionGenerateDto, @Request() req) {
    return this.permissionService.generate(payload, req);
  }
}
