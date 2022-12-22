import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestLogGuardService } from './request_log.gurd.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RequestGuard implements CanActivate {

  constructor (
    private requestLogGuardService: RequestLogGuardService,
    private jwtService: JwtService,
    private userService: UserService,
    private reflector: Reflector
  ) { }


  async canActivate(
    context: ExecutionContext,
  ) {

    const request = context.switchToHttp().getRequest()
    const name = this.reflector.get("name", context.getHandler())

    const path = request.route.path
    const token = request.headers.authorization.replace("Bearer ", "")
    const userId: any | null = this.jwtService.decode(token)

    const user = !!userId ? await this.userService.findOne({ id: userId.id }) : null

    await this.requestLogGuardService.saveRequestLog({
      name,
      user,
      path
    })

    return true;
  }
}
