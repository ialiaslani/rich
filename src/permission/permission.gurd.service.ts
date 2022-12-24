import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { PermissionUtils } from "./permission.utils";

@Injectable()
export class PermissionGuardService extends PermissionUtils {

        constructor (
                private jwtService: JwtService,
                private userService: UserService,
        ) { 
                super()
        }

        async hasPermission(path: string, token: string) {

                const user = this.jwtService.decode(token) as { id: number }
                const permissions = await this.userService.findPermissions(user.id)

                for (const pattern of permissions) {
                        const permission = this.serializePermission(path)
                        const has = this.comparePermission(permission, pattern)
                        if (!has) {
                                return false
                        }
                }


                return true
        }

}
