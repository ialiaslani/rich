import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './model/user.entity';
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
        constructor (
                @InjectRepository(User) private readonly userRepository: Repository<User>
        ) { }

        all(): Promise<User[]> {
                return this.userRepository.find()
        }

        async create(data): Promise<User> {
                const hash = await bcrypt.hash(data.password, 12)
                return this.userRepository.save({ ...data, password: hash })
        }

        async findOne(where): Promise<User> {
                return this.userRepository.findOne({ where })
        }
}
