import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from '../abilities/ability.factory';
import { ROLES_KEY } from '../decorators/role.decorator';
import { RequestWithUser } from '../types/request.type';
import { UserPermission } from '../types/role.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    // private readonly userService: UserService,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles: UserPermission[] = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    return true;
    // const request = context.switchToHttp().getRequest<RequestWithUser>();
    // const currentUser = await this.userService.getUserByEmail(request.user.email as string, {
    //   roles: true,
    // });

    // // if (!currentUser) throw new NotFoundException('User not found');
    // if (!currentUser) return false;

    // const ability = this.abilityFactory.defineAbility(currentUser);
    // return requiredRoles.every((requiredRole) => ability.can(...requiredRole));
  }
}
