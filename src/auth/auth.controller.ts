import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Request,
  Req,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Put('forget-password')
  async forgetPassword(@Req() resetPassword: Request) {
    const body = resetPassword.body as any;
    try {
      if (body.email && body.oldPassword) {
        const isValidPassword = await this.authService.checkPassword(
          body.email,
          body.oldPassword,
        );
        if (isValidPassword) {
          await this.usersService.setPassword(body.email, body.newPassword);
          if (isValidPassword) {
            return { result: 'Success' };
          } else {
            return { result: 'Failed' };
          }
        } else {
          return { result: 'WRONG CURRENT PASSWORD' };
        }
      } else if (body.newPasswordToken) {
        // var forgottenPasswordModel = await this.authService.getForgottenPasswordModel(resetPassword.body.newPasswordToken);
        // isNewPasswordChanged = await this.userService.setPassword(forgottenPasswordModel.email, resetPassword.body.newPassword);
        // if(isNewPasswordChanged) await forgottenPasswordModel.remove();
      } else {
        return { result: 'CHANGE PASSWORD ERROR' };
      }
      return { result: 'PASSWORD_CHANGED' };
    } catch (error) {
      return { result: 'CHANGE PASSWORD ERROR' };
    }
  }
}
