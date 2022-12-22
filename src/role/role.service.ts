import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './models/role.entity';

@Injectable()
export class RoleService {

        constructor (
                @InjectRepository(Role) private readonly roleRepository: Repository<Role>
        ) { }


        async search({ size, page }) {
                const [users, total] = await this.roleRepository.findAndCount({
                        take: size,
                        skip: (page - 1) * size
                })


                return {
                        data: users,
                        meta: {
                                total,
                                page,
                                last_page: Math.ceil(total / size)
                        }
                }
        }

        async findOne(where): Promise<Role> {
                return this.roleRepository.findOne({ where })
        }

        async create(data): Promise<Role> {
                return this.roleRepository.save(data)
        }

        async update(params, data): Promise<any> {
                return this.roleRepository.update(params.id, data)
        }

        async delete(params): Promise<any> {
                return this.roleRepository.delete(params.id)
        }

}
