import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission/permission.guard';
import { PermissionGuardService } from './permission/permission.gurd.service';
import { RequestLogModule } from './request_log/request_log.module';
import { RequestGuard } from './request_log/request_log.guard';
import { RequestLogGuardService } from './request_log/request_log.gurd.service';
import { RequestLog } from './request_log/models/request_log.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'rich',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    CommonModule,
    RequestLogModule,
    TypeOrmModule.forFeature([RequestLog])
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    },
    PermissionGuardService,
    {
      provide: APP_GUARD,
      useClass: RequestGuard
    },
    RequestLogGuardService
  ],
})
export class AppModule { }
