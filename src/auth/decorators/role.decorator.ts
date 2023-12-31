import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { UserPermission } from '../types/role.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserPermission[]): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, roles);
