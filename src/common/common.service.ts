import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export abstract class CommonService {

        protected constructor (
                protected readonly repository: Repository<any>
        ) { }


        async search(payload) {

                const { size = 10, page = 1, all, ...params }: { size?: number, page?: number, all?: boolean } & { [key in string]: string } = payload

                let query = this.repository.createQueryBuilder("repository")

                if (!all) {
                        query.skip((page - 1) * size)
                        query.take(size)
                }

                const serilaizedParmas = this.getParams(params)

                for (const { key, oprator, value } of serilaizedParmas) {
                        if (oprator === "relation") {
                                query.leftJoinAndSelect(`repository.${key}`, `${key}`)
                        } else {
                                query.where(`${key} ${oprator} :${key}`, { [key]: value })
                        }
                }


                const [data, total] = await query.getManyAndCount()


                return {
                        data,
                        meta: {
                                total,
                                ...(!all && {
                                        page: Number(page),
                                        last_page: Math.ceil(total / size)
                                })
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

        getParams(params: { [key in string]: string }) {

                let paramsArray: { key: string, value: string, oprator: "like" | "=" | "relation" }[] = []

                Object.entries(params).forEach(([key, value]) => {

                        let serilaizedValue = value
                        let oprator: "=" | "like" | "relation" = "="

                        if (value.includes(":")) {
                                serilaizedValue = value.split(":")[0]

                                if (value.split(":")[1].toLowerCase() === "like") {
                                        oprator = "like"
                                        serilaizedValue = `%${serilaizedValue}%`
                                } else if (value.split(":")[1].toLowerCase() === "relation") {
                                        oprator = "relation"
                                }

                        }


                        paramsArray.push({
                                key,
                                value: serilaizedValue,
                                oprator
                        })
                })

                return paramsArray
        }

}
