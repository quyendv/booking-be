import { Column, Entity, OneToMany } from 'typeorm';
import { SequenceBaseEntity } from '~/base/a.base.entity';
import { RoleTypes } from '../constants/user.constant';
import { UserEntity } from './user.entity';

@Entity('roles')
export class RoleEntity extends SequenceBaseEntity {
  @Column('varchar', { unique: true })
  name: RoleTypes;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
