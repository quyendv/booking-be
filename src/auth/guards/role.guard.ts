import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/ability.factory';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RequestWithUser } from '../types/request.type';
import { UserPermission } from '../types/role.type';
import { UserService } from '~/users/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: UserPermission[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const ability = await this.abilityFactory.getAbilityByEmail(request.user.email);
    return requiredRoles.every((requiredRole) => ability.can(...requiredRole));
  }
}
