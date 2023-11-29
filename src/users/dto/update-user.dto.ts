import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  name: string;
  @IsString()
  group_id: string;
  @IsString()
  site_id: string;
  @IsString()
  password: string;
  @IsEmail()
  email: string;
}
