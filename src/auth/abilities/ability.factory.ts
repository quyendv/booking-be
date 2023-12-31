import { Injectable } from '@nestjs/common';

@Injectable()
export class AbilityFactory {
  // constructor(private readonly userService: UserService) {}
  // defineAbility(user: UserEntity): AppAbility {
  //   const { can, cannot, build, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);
  //   const filteredRoles = arrayGroupBy(user.roles, (item) => item.name);
  //   const hasAdminRole = (filteredRoles[RoleTypes.ADMIN] || []).length > 0;
  //   const hasExecutiveRole = (filteredRoles[RoleTypes.EXECUTIVE] || []).length > 0;
  //   const hasLeaderRole = (filteredRoles[RoleTypes.LEADER] || []).length > 0;
  //   const hasMemberRole = (filteredRoles[RoleTypes.MEMBER] || []).length > 0;
  //   if (hasAdminRole) {
  //     // can(PermissionActions.MANAGE, 'all');
  //     can(PermissionActions.MANAGE, EmployeeEntity);
  //     // ...
  //   }
  //   if (hasExecutiveRole) {
  //     can(PermissionActions.MANAGE, EmployeeEntity);
  //   }
  //   if (hasLeaderRole) {
  //     can<FlatTaskSheetEntity>(PermissionActions.MANAGE, TaskSheetEntity, {
  //       'team.id': { $in: filteredRoles[RoleTypes.LEADER]?.map((r) => r.teamId) },
  //     });
  //   }
  //   if (hasMemberRole) {
  //     can<FlatTaskSheetEntity>(PermissionActions.READ, TaskSheetEntity, {
  //       'team.id': { $in: filteredRoles[RoleTypes.LEADER]?.map((r) => r.teamId) },
  //     });
  //   }
  //   // Override rules for all roles
  //   can(PermissionActions.READ, ProfileEntity);
  //   // can<FlatProfileEntity>(PermissionActions.MODIFY, ProfileEntity, {
  //   //   'employee.email': user.email,
  //   // });
  //   can(PermissionActions.MODIFY, ProfileEntity, { employeeEmail: user.email });
  //   can(PermissionActions.READ, RoleEntity);
  //   can(PermissionActions.LIST, TeamEntity);
  //   // ... more rules
  //   return build({
  //     detectSubjectType: (item) => item.constructor as ExtractSubjectType<PermissionSubjects>,
  //     resolveAction: aliasPermissionActions,
  //   });
  // }
  // async getAbility(email: string): Promise<AppAbility> {
  //   const user = await this.userService.getUserByEmail(email, { roles: true });
  //   if (!user) throw new ForbiddenException(`User ${email} does not exist`);
  //   return this.defineAbility(user);
  // }
}
