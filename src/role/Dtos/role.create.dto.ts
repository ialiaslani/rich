import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class RoleCreateDto {

        @ApiProperty()
        @IsNotEmpty()
        name: string;

}