import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { RequestLogService } from './request_log.service';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
        constructor (private requestLogService: RequestLogService) { }

        use(request: Request, response: Response, next: NextFunction): void {
                const { ip, method, originalUrl: url } = request;
                const userAgent = request.get('user-agent') || '';

                response.on('close', () => {
                        const { statusCode: status } = response;
                        const contentLength = response.get('content-length');

                        const request_log = { method, url, status, contentLength, userAgent, ip }

                        this.requestLogService.saveRequestLog(request_log as any)
                });

                next();
        }
}