import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ABaseEntity } from '~/base/a.base.entity';
import { RoleTypes } from '../constants/user.constant';
import { RoleEntity } from './role.entity';

@Entity('users')
export class UserEntity extends ABaseEntity {
  @PrimaryColumn('varchar')
  id: string; // email

  @Column('boolean', { default: false, name: 'is_verified' })
  isVerified: boolean;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => RoleEntity, (role) => role.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Expose({ name: 'roleName' })
  get roleName(): RoleTypes {
    return this.role.name;
  }

  // Foreign keys
  @Exclude({ toPlainOnly: true })
  @Column('varchar', { nullable: false })
  role_id: string;
}
