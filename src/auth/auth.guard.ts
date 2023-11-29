import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { SecurityRole } from 'src/entities/roles.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const thePerson = await this.userService.findOneByEmail(payload.email);

      if (
        !this.checkOutThePermission(
          request.method,
          thePerson.data.permissions,
          thePerson.data.userRoles,
        )
      ) {
        throw new ForbiddenException();
      }

      request['user'] = payload;
      request['site_id'] = thePerson.data.site_id;
      request['group_id'] = thePerson.data.group_id;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new ForbiddenException();
      }
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  private checkOutThePermission = (
    method: string,
    perm: any[],
    securtyUserRole: SecurityRole,
  ) => {
    if (securtyUserRole.role_code !== 'SV') {
      if (method === 'GET') {
        const theFound = perm.findIndex((el) => {
          return el.permision_name === 'read';
        });
        return theFound !== -1;
      } else if (method === 'PUT' || method === 'POST') {
        const theFound = perm.indexOf((el) => el.permision_name === 'write');
        return theFound !== -1;
      } else if (method === 'DELETE') {
        const theFound = perm.indexOf((el) => el.permision_name === 'delete');
        return theFound !== -1;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
}
