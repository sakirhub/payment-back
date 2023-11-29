import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Permision } from 'src/permisions/entities/permision.entity';
import { SecurityRole } from 'src/entities/roles.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Permision, SecurityRole])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
