import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
        constructor (
                @InjectRepository(User) private readonly userRepository: Repository<User>
        ) { }

        async search({ size, page }) {
                const [users, total] = await this.userRepository.findAndCount({
                        take: size,
                        skip: (page - 1) * size
                })
              
              
                return {
                        data: users,
                        meta: {
                                total,
                                page,
                                last_page: Math.ceil(total/size)
                        }
                }
        }

        async create(data): Promise<User> {
                const hash = await bcrypt.hash(data.password, 12)
                return this.userRepository.save({ ...data, password: hash })
        }

        async findOne(where): Promise<User> {
                return this.userRepository.findOne({ where })
        }
}
