import { Injectable } from '@nestjs/common';
import { CreatePermisionDto } from './dto/create-permision.dto';
import { UpdatePermisionDto } from './dto/update-permision.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SecurityRole } from 'src/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermisionsService {
  constructor(
    @InjectRepository(SecurityRole)
    private roleRepo: Repository<SecurityRole>,
  ) {}
  create(createPermisionDto: CreatePermisionDto) {
    return 'This action adds a new permision';
  }

  findAll() {
    return `This action returns all permisions`;
  }
  findAllRoles() {
    return this.roleRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} permision`;
  }

  update(id: number, updatePermisionDto: UpdatePermisionDto) {
    return `This action updates a #${id} permision`;
  }

  remove(id: number) {
    return `This action removes a #${id} permision`;
  }
}
