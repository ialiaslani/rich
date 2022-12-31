import { ClassSerializerInterceptor, Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RequestLogSearchDto } from './Dtos/reaquest_log.search.dto';
import { RequestLogService } from './request_log.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@ApiTags('request-log')
@Controller('request-log')
export class RequestLogController {

        constructor (private requestLogService: RequestLogService) { }

        @Get("search")
        async search(@Query() payload: RequestLogSearchDto) {
                return await this.requestLogService.search({ ...payload, user: ":relation" })
        }

}
