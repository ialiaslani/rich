import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
import { ElasticsearchModule } from '@nestjs/elasticsearch';

type TRichImports = {
  type: string;
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: string;
  synchronize: boolean;
  elasticHost: string;
};

@Module({})
export class RichModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}

export const RichImports = ({ elasticHost, ...dbConfig }: TRichImports) => [
  TypeOrmModule.forRoot(dbConfig as object as TypeOrmModuleOptions),
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
  ElasticsearchModule.register({
    node: elasticHost
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
