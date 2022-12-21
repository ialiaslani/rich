import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionController } from './permission.controller';

@Module({
  controllers: [PermissionController],
  providers: [AuthGuard, JwtService],
})
export class PermissionModule {}
