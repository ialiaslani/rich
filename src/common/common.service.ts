import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class CommonService {

        protected constructor (
                protected readonly repository: Repository<any>
        ) { }


        async search({ size, page }, relations = []) {
                const [users, total] = await this.repository.findAndCount({
                        take: size,
                        skip: (page - 1) * size,
                        relations
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

        async findOne(where, relations = []): Promise<any> {
                return this.repository.findOne({ where, relations })
        }

        async create(data): Promise<any> {
                return this.repository.save(data)
        }

        async update(params, data): Promise<any> {
                return this.repository.update(params.id, data)
        }

        async delete(params): Promise<any> {
                return this.repository.delete(params.id)
        }

}
