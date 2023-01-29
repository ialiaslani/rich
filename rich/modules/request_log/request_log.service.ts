import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestLog } from './models/request_log.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';

@Injectable()
export class RequestLogService extends CommonService {
  constructor(@InjectRepository(RequestLog) private readonly requestLogRepository: Repository<RequestLog>) {
    super(requestLogRepository);
  }

  async saveRequestLog(data) {
    return await this.requestLogRepository.save(data);
  }
}
