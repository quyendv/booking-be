import { InferSubjects, MongoAbility, createAliasResolver } from '@casl/ability';

export enum PermissionActions {
  READ = 'read',
  GET = 'get',
  LIST = 'list',

  WRITE = 'write',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',

  SHARE = 'share',
  MODIFY = 'modify',

  MANAGE = 'manage',
}

export type PermissionSubjects = InferSubjects</* typeof EmployeeEntity | */ 'all'>;

export type UserPermission = [PermissionActions, PermissionSubjects];

export type AppAbility = MongoAbility<UserPermission>;

export const aliasPermissionActions = createAliasResolver({
  [PermissionActions.MODIFY]: [PermissionActions.UPDATE, PermissionActions.DELETE],
  [PermissionActions.READ]: [PermissionActions.GET, PermissionActions.LIST],
  [PermissionActions.WRITE]: [PermissionActions.MODIFY, PermissionActions.CREATE],
});
