import { Module } from '@nestjs/common';
import { RequestLog } from './models/request_log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
        imports: [
                TypeOrmModule.forFeature([RequestLog])
        ],
})
export class RequestLogModule { }
