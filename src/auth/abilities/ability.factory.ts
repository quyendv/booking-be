import { AbilityBuilder, createMongoAbility, ExtractSubjectType } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { RoleTypes } from '~/users/constants/user.constant';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import {
  aliasPermissionActions,
  AppAbility,
  PermissionActions,
  PermissionSubjects,
} from '../types/role.type';

@Injectable()
export class AbilityFactory {
  constructor(private readonly userService: UserService) {}
  defineAbility(user: UserEntity): AppAbility {
    const { can, cannot, build, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const role = user.roleName;

    if (role === RoleTypes.ADMIN) {
      can(PermissionActions.MANAGE, 'all');
    }

    if (role === RoleTypes.CUSTOMER) {
      can(PermissionActions.UPDATE, CustomerEntity, { id: user.id });
    }

    return build({
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<PermissionSubjects>,
      resolveAction: aliasPermissionActions,
    });
  }

  async getAbilityByEmail(email: string): Promise<AppAbility> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new ForbiddenException(`User ${email} does not exist`);
    return this.defineAbility(user);
  }
}
