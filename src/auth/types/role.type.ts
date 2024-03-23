import { InferSubjects, MongoAbility, createAliasResolver } from '@casl/ability';
import { BookingEntity } from '~/bookings/entities/booking.entity';
import { ReviewEntity } from '~/reviews/entities/review.entity';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';
import { RoomEntity } from '~/hotels/entities/room.entity';
import { ReceptionistEntity } from '~/receptionists/entities/receptionist.entity';

export enum PermissionActions {
  READ = 'read',
  GET = 'get',
  LIST = 'list',

  WRITE = 'write',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',

  MODIFY = 'modify',

  MANAGE = 'manage',
}

export type PermissionSubjects = InferSubjects<
  | typeof CustomerEntity
  | typeof HotelEntity
  | typeof RoomEntity
  | typeof BookingEntity
  | typeof ReviewEntity
  | typeof ReceptionistEntity
  | 'firebase-account'
  | 'all'
>;

export type UserPermission = [PermissionActions, PermissionSubjects];

export type AppAbility = MongoAbility<UserPermission>;

export const aliasPermissionActions = createAliasResolver({
  [PermissionActions.MODIFY]: [PermissionActions.UPDATE, PermissionActions.DELETE],
  [PermissionActions.READ]: [PermissionActions.GET, PermissionActions.LIST],
  [PermissionActions.WRITE]: [PermissionActions.MODIFY, PermissionActions.CREATE],
});

// Flat Type
export type FlatReviewBookingCustomer = ReviewEntity & {
  'booking.customerEmail': ReviewEntity['booking']['customerEmail'];
};
