import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserService } from 'src/app/modules/users/services/users.service';
import { Role } from 'src/library/enums/role.enum';

const validate = (requiredRoles: Role[], role: Role) => {
  return requiredRoles.includes(role) || role === Role.ADMIN;
};

@Injectable()
class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = await this.userService.findOneById(request.user.sub);

    if (!user) throw new UnauthorizedException();

    return validate(requiredRoles, user.role);
  }
}

export { RolesGuard };
