import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from './model/user.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService
  ]
})
export class UserModule {}
