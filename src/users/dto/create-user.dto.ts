import { IsEmail, IsString } from 'class-validator';
export class CreateUserDto {
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  role_id: number;
  site_id: any | null;
  group_id: any | null;
}
