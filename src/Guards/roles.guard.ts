import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../Decorators/roles.decorator';
import { Roles } from '../lib/enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedRoles || allowedRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
