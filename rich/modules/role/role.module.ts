import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './models/role.entity';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, AuthGuard, JwtService],
})
export class RoleModule {}
