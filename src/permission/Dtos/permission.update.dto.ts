import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CommonParamsDto } from 'src/common/Dtos/common.params.dto';


export class PermissionUpdateParamsDto extends CommonParamsDto {}

export class PermissionUpdatePayloadDto {

        @ApiProperty()
        @IsNotEmpty()
        name: string;

}