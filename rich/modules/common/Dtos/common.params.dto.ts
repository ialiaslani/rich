import { ApiProperty } from '@nestjs/swagger';

export class CommonParamsDto {
  @ApiProperty()
  id: number;
}
