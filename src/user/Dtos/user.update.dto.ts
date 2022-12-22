import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CommonParamsDto } from 'src/common/Dtos/common.params.dto';


export class UserUpdateParamsDto extends CommonParamsDto { }


class UserUpdateRolesDto {
        id: number
}

export class UserUpdatePayloadDto {

        @IsNotEmpty()
        @ApiProperty()
        name: string

        @IsNotEmpty()
        @IsEmail()
        @ApiProperty()
        email: string

        @IsNotEmpty()
        @ApiProperty()
        password: string



        @ApiProperty({
                default: [{
                        id: "number"
                }]
        })
        roles: UserUpdateRolesDto[];

}