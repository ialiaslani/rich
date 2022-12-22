import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PermissionGuardService } from './permission.gurd.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  constructor (
    private permissionGuardService: PermissionGuardService,
  ) { }


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest()

    const path = request.route.path.replace("/api", "")
    const token = request.headers.authorization.replace("Bearer ", "")

    this.permissionGuardService.hasPermission(path, token)

    return true;
  }
}
