import { ApiProperty } from '@nestjs/swagger';


export class UserSearchDto {

        @ApiProperty()
        page: number

        @ApiProperty()
        size: number

        @ApiProperty({ required: false })
        name: string

        @ApiProperty({ required: false })
        all: boolean

        @ApiProperty({ required: false })
        roles: string

}