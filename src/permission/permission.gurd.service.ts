import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class PermissionGuardService {

        constructor (
                private jwtService: JwtService,
                private userService: UserService,
        ) { }

        async hasPermission(path: string, token: string) {

                const user = this.jwtService.decode(token) as { id: number }
                const permissions = await this.userService.findPermissions(user.id)

                for (const permission of permissions) {
                        const has = this.comparePermission(path, permission)
                        if (!has) {
                                return false
                        }
                }


                return true
        }

        comparePermission(currentRoute, permission) {


                return true
        }
}
