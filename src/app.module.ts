import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission/permission.guard';
import { PermissionGuardService } from './permission/permission.gurd.service';
import { AppLoggerMiddleware } from './request_log/request_log.middleware';
import { RequestLog } from './request_log/models/request_log.entity';
import { RequestLogService } from './request_log/request_log.service';
import { RequestLogModule } from './request_log/request_log.module';
import { CacheModule } from './cache/cache.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `./.env` }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES,
      synchronize: true,
    } as any),
    AuthModule,
    UserModule,
    PermissionModule,
    RoleModule,
    CommonModule,
    TypeOrmModule.forFeature([RequestLog]),
    RequestLogModule,
    CacheModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    },
    PermissionGuardService,
    RequestLogService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
