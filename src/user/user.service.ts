import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import * as bcrypt from "bcrypt"
import { CommonService } from 'src/common/common.service';

@Injectable()
export class UserService extends CommonService {
        constructor (
                @InjectRepository(User) private readonly userRepository: Repository<User>
        ) {
                super(userRepository)
        }

        async create(data): Promise<User> {
                const hash = await bcrypt.hash(data.password, 12)
                return this.repository.save({ ...data, password: hash, roles: [{ id: 2 }] })
        }

        async update(params, data): Promise<any> {
                const hash = await bcrypt.hash(data.password, 12)
                return await this.repository.update(params, { ...data, password: hash })
        }

        async saveAvatar(id, image = ""): Promise<any> {
                return this.userRepository.update(id, {
                        image
                })
        }

        async findPermissions(id) {
                const user = await this.userRepository.findOne({ where: { id }, relations: ["roles", "roles.permissions"] })

                let permissions = []

                user.roles.forEach(role => {
                        permissions = [...permissions, ...role.permissions.map(permission => permission.name)]
                })

                return permissions
        }
}
