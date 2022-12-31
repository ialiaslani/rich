import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class PermissionCreateDto {

        @ApiProperty()
        @IsNotEmpty()
        name: string;

        @ApiProperty()
        @IsNotEmpty()
        pattern: string;

}