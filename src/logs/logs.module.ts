import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SecurityRole } from 'src/entities/roles.entity';
import { Logs } from 'src/entities/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Logs, User, SecurityRole])],
  controllers: [LogsController],
  providers: [LogsService, UsersService],
})
export class LogsModule {}
