import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService],
  exports: [
    JwtService
  ]
})
export class CommonModule {}
