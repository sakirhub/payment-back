import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Permision } from 'src/permisions/entities/permision.entity';
import { bringSqlWithJoinsColumns } from 'src/helpers/QueryBuilder';
import { SecurityRole } from 'src/entities/roles.entity';
import { SecurityRolePermisions } from 'src/entities/roles.permisions.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SecurityRole)
    private roleRepo: Repository<SecurityRole>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.email_verified_at = new Date();
    user.password = await bcrypt.hashSync(createUserDto.password, 10);
    user.role_id = createUserDto.role_id;
    user.site_id = createUserDto.site_id;
    user.group_id = createUserDto.group_id;
    user.created = new Date();
    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while creating user.' + error.message,
      );
    }
  }

  async findAll() {
    try {
      const theQuery =
        this.usersRepository.manager.connection.createQueryBuilder();
      const theAdditionalSelectForPerm = {
        select: ['sr.role_name as role_name', 'sr.role_code as role_code'],
        joins: [
          {
            type: 'inner',
            entity: SecurityRole,
            alias: 'sr',
            relation: 'user.role_id=sr.id',
          },
        ],
        where: '',
      };

      const users = await bringSqlWithJoinsColumns(
        theQuery,
        this.usersRepository,
        theAdditionalSelectForPerm,
        'user',
      ).getRawMany();
      if (!users || users.length === 0) {
        throw new NotFoundException('No users found.');
      }

      return {
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching users.',
      );
    }
  }
  async setPassword(email: string, newPassword: string): Promise<boolean> {
    try {
      const userFromDb = await this.findOne({ email });
      if (!userFromDb)
        throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
      userFromDb.password = await bcrypt.hash(newPassword, 10);
      const theUID = userFromDb.id;
      delete userFromDb.id;
      this.update(theUID, userFromDb);
      return true;
    } catch (error) {
      return false;
    }
  }

  async findOne(id: any) {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching user.',
      );
    }
  }

  async findOneByEmail(email: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { email: email },
      });
      const userRoles = await this.roleRepo.findOne({
        where: { id: user.role_id },
      });
      const theWhereClause = `{
      "f": "email",
      "c": "=",
      "t": "where",
      "v": "${email}"
    }`;
      const theQuery =
        this.usersRepository.manager.connection.createQueryBuilder();
      const theAdditionalSelectForPerm = {
        select: [
          'sr.role_name as role_name',
          'sr.role_code as role_code',
          'p.permision_name as permision_name',
          'p.value as value',
        ],
        joins: [
          {
            type: 'inner',
            entity: SecurityRole,
            alias: 'sr',
            relation: 'user.role_id=sr.id',
          },
          {
            type: 'inner',
            entity: SecurityRolePermisions,
            alias: 'srp',
            relation: 'srp.role_id=sr.id',
          },
          {
            type: 'inner',
            entity: Permision,
            alias: 'p',
            relation: 'p.id=srp.permission_id',
          },
        ],
        where: theWhereClause,
      };

      const permissions = await bringSqlWithJoinsColumns(
        theQuery,
        this.usersRepository,
        theAdditionalSelectForPerm,
        'user',
      ).getRawMany();
      if (!user) {
        throw new NotFoundException('User not found.');
      }
      return {
        message: 'User retrieved successfully',
        data: { ...user, permissions, userRoles },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while fetching user.',
      );
    }
  }

  async update(id: any, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id: id });
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      if (
        user.name === updateUserDto.name &&
        user.group_id === updateUserDto?.group_id &&
        updateUserDto?.role_id === user.role_id
      ) {
        return {
          message: 'No changes detected',
          data: {},
        };
      }

      await this.usersRepository.update(id, updateUserDto);

      return {
        message: 'User updated successfully',
        data: updateUserDto,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while updating user.',
      );
    }
  }

  async remove(id: any) {
    try {
      const deleteResult = await this.usersRepository.delete(id);

      if (deleteResult.affected > 0) {
        return {
          message: 'User deleted successfully',
          data: {},
        };
      } else {
        throw new NotFoundException('User not found.');
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting user.',
      );
    }
  }

  async findBy(email: string) {
    try {
      const user = await this.usersRepository.findOneBy({ email: email });

      if (!user) {
        throw new NotFoundException('User not found.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('An error occurred while fetching user.');
    }
  }
}
