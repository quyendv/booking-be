import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SequenceBaseEntity } from '~/base/a.base.entity';
import { ColumnNumericTransformer } from '~/base/transformers/numeric.transformer';
import { HotelEntity } from './hotel.entity';

@Entity('hotel_rooms')
export class RoomEntity extends SequenceBaseEntity {
  @Column('varchar', { name: 'title' })
  title: string;

  @Column('varchar', { name: 'description' })
  description: string;

  @Column('varchar', { name: 'image_url' })
  imageUrl: string;

  @Column('varchar', { name: 'image_key', nullable: true })
  imageKey: string;

  @ManyToOne(() => HotelEntity, (hotel) => hotel.rooms)
  @JoinColumn({ name: 'hotel_id' })
  hotel: HotelEntity;

  @Column('int', { name: 'bed_count', default: 0 })
  bedCount: number;

  @Column('int', { name: 'guest_count', default: 0 })
  guestCount: number;

  @Column('int', { name: 'bathroom_count', default: 0 })
  bathroomCount: number;

  @Column('int', { name: 'king_bed', default: 0 })
  kingBed: number;

  @Column('int', { name: 'queen_bed', default: 0 })
  queenBed: number;

  @Column('decimal', {
    name: 'breakfast_price',
    precision: 7,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  breakFastPrice: number;

  @Column('decimal', {
    name: 'room_price',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  roomPrice: number;

  @Column('bool', { name: 'room_service', default: false })
  roomService: boolean;

  @Column('bool', { name: 'tv', default: false })
  tv: boolean;

  @Column('bool', { name: 'balcony', default: false })
  balcony: boolean;

  @Column('bool', { name: 'free_wifi', default: false })
  freeWifi: boolean;

  @Column('bool', { name: 'city_view', default: false })
  cityView: boolean;

  @Column('bool', { name: 'ocean_view', default: false })
  oceanView: boolean;

  @Column('bool', { name: 'forest_view', default: false })
  forestView: boolean;

  @Column('bool', { name: 'mountain_view', default: false })
  mountainView: boolean;

  @Column('bool', { name: 'air_condition', default: false })
  airCondition: boolean;

  @Column('bool', { name: 'sound_proofed', default: false })
  soundProofed: boolean;
}
