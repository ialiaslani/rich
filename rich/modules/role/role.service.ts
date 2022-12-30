import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';
import { CommonService } from '../common/common.service';

@Injectable()
export class RoleService extends CommonService {

        constructor (
                @InjectRepository(Role) private readonly roleRepository: Repository<Role>
        ) {
                super(roleRepository)
        }

}
