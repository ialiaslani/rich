import { ApiProperty } from '@nestjs/swagger';


export class UserSearchDto {

        @ApiProperty()
        page: number

        @ApiProperty()
        size: number

}