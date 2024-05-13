import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { AddressEntity } from '~/address/entities/address.entity';
import { TimestampEntity } from '~/base/a.base.entity';
import { GenderTypes } from '~/customers/constants/customer.constant';
import { UserEntity } from '~/users/entities/user.entity';
import { HotelEntity } from './hotel.entity';

@Entity('hotel_managers')
export class HotelManagerEntity extends TimestampEntity {
  @PrimaryColumn('varchar')
  id: string; // email

  @Column('varchar', { name: 'name' })
  name: string;

  @Column('varchar', { nullable: true })
  avatar: string | null;

  @Column('varchar', { nullable: true })
  avatarKey: string | null;

  @Column('date', { nullable: true })
  birthday: string;

  @Column('varchar', { nullable: true })
  phone: string;

  @Column('varchar', { nullable: true })
  gender: GenderTypes;

  @OneToOne(() => UserEntity, (user) => user.hotelManager, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => AddressEntity, { nullable: true, cascade: true })
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;

  @OneToOne(() => HotelEntity, (hotel) => hotel.manager)
  hotel: HotelEntity;

  // Foreign Keys
  @Exclude({ toPlainOnly: true })
  @Column('int', { name: 'address_id', nullable: true })
  addressId: number;

  @Exclude({ toPlainOnly: true })
  @Column('varchar', { name: 'user_id' })
  userId: string;
}
