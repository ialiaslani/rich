import { Controller, Request, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Router } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth("access-token")
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('permission')
@Controller('permission')
export class PermissionController {


        @Get("/search")
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
