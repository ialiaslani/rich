import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

class RoleCreatePermissionDto {
  id: number;
}

export class RoleCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    default: [
      {
        id: 'number',
      },
    ],
  })
  permissions: RoleCreatePermissionDto[];
}
