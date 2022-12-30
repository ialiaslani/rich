import { Injectable } from '@nestjs/common';
import * as excel from 'exceljs';
import { format } from 'date-fns-jalali';
import { CommonEntity } from '../common/models/common.entity';

@Injectable()
export class ExcelService {

        async exportExcel(
                sheetName: string,
                records: CommonEntity[] = [],
                columns: object[] = []
        ): Promise<excel.Buffer> {

                //creating workbook
                let workbook = new excel.Workbook();
                let worksheet = workbook.addWorksheet(sheetName);

                // change time
                if (process.env.LANGUAGE === "fa") {

                        records.forEach((record: CommonEntity) => {

                                if (record.updated_at) {
                                        record.updated_at = format(record.updated_at as any, "yyyy-MM-dd");
                                }


                                if (record.created_at) {
                                        record.created_at = format(record.created_at as any, "yyyy-MM-dd");
                                }
                        });

                }
                worksheet.columns = columns;
                worksheet.addRows(records);

                const buffer = await workbook.xlsx.writeBuffer();

                return buffer;
        }
}
