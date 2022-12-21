import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Router } from 'express';
import { CommonService } from 'src/common/common.service';
import { Repository } from 'typeorm';
import { Permission } from './models/permission.entity';

@Injectable()
export class PermissionService extends CommonService {

        constructor (
                @InjectRepository(Permission) private readonly permissionRepository: Repository<Permission>
        ) {
                super(permissionRepository)
        }


        root(@Request() req: any) {
                const router = req.app._router as Router;
                const routes = router.stack
                        .map(layer => {
                                if (layer.route && !layer.route?.path.includes("docs")) {
                                        const path = layer.route?.path;
                                        const method = layer.route?.stack[0].method;
                                        return { method, path }
                                }
                        })
                        .filter(item => item !== undefined)
                return {
                        routes
                }
        }
}
