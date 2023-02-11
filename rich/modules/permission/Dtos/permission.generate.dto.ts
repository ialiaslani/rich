import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PermissionGenerateDto {
  @ApiProperty()
  @IsNotEmpty()
  permissions: string[];

  @ApiProperty()
  @IsNotEmpty()
  role_id: number;
}
