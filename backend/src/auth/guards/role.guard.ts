import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/role.decorator';
import { Role } from '../roles.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    // const dummyUserRoles = [Role.USER];

    Logger.log(`requiredRoles ${requiredRoles}`, 'RoleGuard');
    Logger.log(`user ${JSON.stringify(user)}`, 'RoleGuard');

    if (!requiredRoles) return true;
    return requiredRoles.some((role) => user.role?.includes(role));
  }
}
