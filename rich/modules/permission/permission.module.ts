import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './models/permission.entity';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { PermissionUtils } from './permission.utils';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionController],
  providers: [AuthGuard, JwtService, PermissionService, PermissionUtils],
})
export class PermissionModule {}
