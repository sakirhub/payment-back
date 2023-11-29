import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async checkPassword(email: string, password: string) {
    const userFromDb = await this.usersService.findOne({ email: email });
    if (!userFromDb)
      throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    return await bcrypt.compare(password, userFromDb.password);
  }
  async login(loginAuthDto: LoginAuthDto) {
    const user = await this.usersService.findBy(loginAuthDto.email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    if (!user.email_verified_at) {
      throw new UnauthorizedException('Email not verified.');
    }
    const payload = {
      name: user.name,
      email: user.email,
      sub: user.id,
      profile_photo_path: user.profile_photo_path,
      site: user.site_id,
      group: user.group_id,
      role: user.role_id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }
}
