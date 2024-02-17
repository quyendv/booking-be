import { Column, Entity } from 'typeorm';
import { SequenceBaseEntity } from '~/base/a.base.entity';

@Entity('addresses')
export class AddressEntity extends SequenceBaseEntity {
  @Column('varchar')
  address: string; // street, house number, etc.

  @Column('varchar', { nullable: true })
  district: string;

  @Column('varchar')
  province: string;

  @Column('varchar')
  country: string;

  // Relations
  // @OneToOne(() => CustomerEntity, (customer) => customer.address)
  // customer: CustomerEntity[];
}
