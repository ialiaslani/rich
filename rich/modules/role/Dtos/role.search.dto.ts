import { ApiProperty } from '@nestjs/swagger';

export class RoleSearchDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  size: number;
}
