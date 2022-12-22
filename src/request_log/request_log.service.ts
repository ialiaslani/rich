import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequestLog } from "./models/request_log.entity";
import { Repository } from "typeorm";

@Injectable()
export class RequestLogService {

        constructor (
                @InjectRepository(RequestLog) private readonly requestLogRepository: Repository<RequestLog>
        ) { }

        async saveRequestLog({
                user,
                ...data
        }) {

                return await this.requestLogRepository.save(data)
        }
}
