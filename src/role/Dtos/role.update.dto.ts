import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class RoleUpdateParamsDto {

        @ApiProperty()
        id: number

}


class RoleUpdatePermissionDto {
        id: number
}

export class RoleUpdatePayloadDto {

        @ApiProperty()
        @IsNotEmpty()
        name: string;

        @ApiProperty({
                default: [{
                        id: "number"
                }]
        })
        permissions: RoleUpdatePermissionDto[];
}