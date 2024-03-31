import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { ABaseEntity } from '~/base/a.base.entity';
import { RoleTypes } from '../constants/user.constant';
import { RoleEntity } from './role.entity';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelManagerEntity } from '~/hotels/entities/hotel-manager.entity';
import { ReceptionistEntity } from '~/receptionists/entities/receptionist.entity';

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

  @OneToOne(() => CustomerEntity, (customer) => customer.user, { nullable: false })
  customer: CustomerEntity;

  @OneToOne(() => HotelManagerEntity, (hotelManager) => hotelManager.user, { nullable: false })
  hotelManager: HotelManagerEntity;

  @OneToOne(() => ReceptionistEntity, (receptionist) => receptionist.user, { nullable: false })
  receptionist: ReceptionistEntity;

  // Foreign keys
  @Exclude({ toPlainOnly: true })
  @Column('varchar', { nullable: false })
  role_id: string;
}
