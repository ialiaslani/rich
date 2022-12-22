import { Module } from '@nestjs/common';
import { RequestLogController } from './request_log.controller';
import { RequestLogService } from './request_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestLog } from './models/request_log.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequestLog]),
    CommonModule
  ],
  controllers: [RequestLogController],
  providers: [RequestLogService]
})
export class RequestLogModule { }
