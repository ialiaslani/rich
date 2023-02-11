import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RichImports, RichModule, RichProviders } from '@rich';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `./.env` }),
    ...RichImports({
      type: process.env.DB_TYPE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: process.env.DB_AUTO_LOAD_ENTITIES,
      synchronize: true,
      elasticHost: process.env.ELASTIC_HOST,
    }),
  ],
  providers: [...RichProviders],
})
export class AppModule extends RichModule {}
