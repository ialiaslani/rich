import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  providers: [JwtService, AuthGuard],
  exports: [
    JwtService,
    AuthGuard
  ]
})
export class CommonModule {}
