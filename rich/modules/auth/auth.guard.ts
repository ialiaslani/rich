import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    try {
      const request: Request = context.switchToHttp().getRequest();

      const token = request.headers.authorization.replace('Bearer ', '');
      return this.jwtService.verify(token, { secret: process.env.TOKEN_SECRET });
    } catch (error) {
      return false;
    }
  }
}
