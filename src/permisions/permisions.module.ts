import { Module } from '@nestjs/common';
import { PermisionsService } from './permisions.service';
import { PermisionsController } from './permisions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityRole } from 'src/entities/roles.entity';

@Module({
  controllers: [PermisionsController],
  providers: [PermisionsService],
  imports: [TypeOrmModule.forFeature([SecurityRole])],
})
export class PermisionsModule {}
