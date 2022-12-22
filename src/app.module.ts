import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { AppLoggerMiddleware } from './request_log/request_log.middleware';
import { RequestLog } from './request_log/models/request_log.entity';
import { RequestLogService } from './request_log/request_log.service';

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
    TypeOrmModule.forFeature([RequestLog])
  ],
  providers: [
    AppService,
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
