import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from './models/user.entity';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserController } from './user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
  exports: [
    UserService
  ]
})
export class UserModule {}
