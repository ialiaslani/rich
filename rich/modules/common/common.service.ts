import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExcelService } from '../excel/excel.service';

@Injectable()
export abstract class CommonService extends ExcelService {
  protected constructor(protected readonly repository: Repository<any>) {
    super();
  }

  async search(payload, columns?: { header: string; key: string; width: number }[]) {
    const {
      size = 10,
      page = 1,
      all,
      getExcel,
      ...params
    }: { size?: number; page?: number; all?: boolean; getExcel?: boolean } & { [key in string]: string } = payload;

    const query = this.repository.createQueryBuilder('repository');

    if (!all || !getExcel) {
      query.skip((page - 1) * size);
      query.take(size);
    }

    const serilaizedParmas = this.getParams(params);

    for (const { key, oprator, value } of serilaizedParmas) {
      if (oprator === 'relation') {
        query.leftJoinAndSelect(`repository.${key}`, `${key}`);
      } else {
        query.where(`${key} ${oprator} :${key}`, { [key]: value });
      }
    }

    const [data, total] = await query.getManyAndCount();

    if (getExcel) {
      const defaultColumns = Object.keys(data[0] || []).map((key) => ({ header: key, key, width: 30 }));
      return await this.exportExcel(params.sheetName || 'deafult', data, columns || defaultColumns);
    }

    return {
      data,
      meta: {
        total,
        ...(!all && {
          page: Number(page),
          last_page: Math.ceil(total / size),
        }),
      },
    };
  }

  async findOne(where, relations = []): Promise<any> {
    return this.repository.findOne({ where, relations });
  }

  async create(data): Promise<any> {
    return this.repository.save(data);
  }

  async update(params, data): Promise<any> {
    return this.repository.update(params.id, data);
  }

  async delete(params): Promise<any> {
    return this.repository.delete(params.id);
  }

  getParams(params: { [key in string]: string }) {
    const paramsArray: { key: string; value: string; oprator: 'like' | '=' | 'relation' }[] = [];

    Object.entries(params).forEach(([key, value]) => {
      let serilaizedValue = value;
      let oprator: '=' | 'like' | 'relation' = '=';

      if (value.includes(':')) {
        serilaizedValue = value.split(':')[0];

        if (value.split(':')[1].toLowerCase() === 'like') {
          oprator = 'like';
          serilaizedValue = `%${serilaizedValue}%`;
        } else if (value.split(':')[1].toLowerCase() === 'relation') {
          oprator = 'relation';
        }
      }

      paramsArray.push({
        key,
        value: serilaizedValue,
        oprator,
      });
    });

    return paramsArray;
  }
}
