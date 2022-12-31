import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Router } from 'express';
import { Repository } from 'typeorm';
import { Permission } from './models/permission.entity';
import { PermissionUtils } from './permission.utils';
import { PermissionGenerateDto } from './Dtos/permission.generate.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class PermissionService extends CommonService {

        constructor (
                @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>,
                private permissionUtils: PermissionUtils
        ) {
                super(permissionRepository)
        }


        allRoutes(req) {
                const router = req.app._router as Router;
                const routes = router.stack
                        .map(layer => {
                                if (layer.route && !(
                                        layer.route?.path.includes("docs") ||
                                        layer.route?.path.includes("register") ||
                                        layer.route?.path.includes("login")
                                )) {
                                        const path = layer.route?.path;
                                        const pattern = this.permissionUtils.serializePermission(path)
                                        const method = layer.route?.stack[0].method;
                                        return { method, path, pattern }
                                }
                        })
                        .filter(item => item !== undefined)
                return {
                        routes
                }
        }


        async generate({ permissions, role_id }: PermissionGenerateDto, req) {

                const allRoutes = this.allRoutes(req).routes.map(r => r.path)
                const patterns = this.permissionUtils.generatePermission(allRoutes, permissions)

                for await (const pattern of patterns) {
                        await this.create({ pattern, name: "no-name", roles: [{ id: role_id }] })
                }

                return patterns
        }
}
