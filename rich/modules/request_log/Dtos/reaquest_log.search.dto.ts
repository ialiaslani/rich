import { ApiProperty } from '@nestjs/swagger';


export class RequestLogSearchDto {

        @ApiProperty()
        page: number

        @ApiProperty()
        size: number

}