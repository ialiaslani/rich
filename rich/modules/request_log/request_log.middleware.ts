import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { RequestLogService } from './request_log.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private requestLogService: RequestLogService, private jwtService: JwtService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const {
      ip,
      method,
      originalUrl: url,
      headers: { authorization = '' },
    } = request;
    const userAgent = request.get('user-agent') || '';
    const token = authorization.replace('Bearer ', '');

    const user: any = this.jwtService.decode(token);

    response.on('close', () => {
      const { statusCode: status } = response;
      const contentLength = response.get('content-length');

      const request_log = {
        method,
        url,
        status,
        contentLength,
        userAgent,
        ip,
        user: { id: user ? user.id : null },
      } as any;

      this.requestLogService.saveRequestLog(request_log);
    });

    next();
  }
}
