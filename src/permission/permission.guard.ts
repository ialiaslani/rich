import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PermissionGuardService } from './permission.gurd.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor (
    private permissionGuardService: PermissionGuardService,
    private reflector: Reflector
  ) { }


  async canActivate(
    context: ExecutionContext,
  ) {

    const publicRoute = this.reflector.get("access", context.getHandler())

    if (publicRoute) return true

    const request = context.switchToHttp().getRequest()

    const path = request.route.path.replace("/api", "")
    const token = request.headers.authorization.replace("Bearer ", "")


    return await this.permissionGuardService.hasPermission(path, token);
  }
}
