import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { RequestLog } from './request_log/models/request_log.entity';
import { RequestLogModule } from './request_log/request_log.module';
import { PermissionGuard } from './permission/permission.guard';
import { PermissionGuardService } from './permission/permission.gurd.service';
import { RequestLogService } from './request_log/request_log.service';
import { AppLoggerMiddleware } from './request_log/request_log.middleware';
import { CacheModule } from './cache/cache.module';

@Module({})
export class RichModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

export const RichImports = (dbConfig: object) => [
  TypeOrmModule.forRoot(dbConfig),
  AuthModule,
  UserModule,
  PermissionModule,
  RoleModule,
  CommonModule,
  TypeOrmModule.forFeature([RequestLog]),
  RequestLogModule,
  CacheModule,
  MulterModule.register({
    dest: './upload',
  }),
];

export const RichProviders = [
  {
    provide: APP_GUARD,
    useClass: PermissionGuard,
  },
  PermissionGuardService,
  RequestLogService,
];
