import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Permision } from 'src/permisions/entities/permision.entity';
import { SecurityRole } from 'src/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permision, SecurityRole])],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtService],
})
export class AuthModule {}
