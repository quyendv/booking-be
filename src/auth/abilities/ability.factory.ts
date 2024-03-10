import { AbilityBuilder, createMongoAbility, ExtractSubjectType } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CustomerEntity } from '~/customers/entities/customer.entity';
import { HotelEntity } from '~/hotels/entities/hotel.entity';
import { HotelService } from '~/hotels/hotel.service';
import { RoleTypes } from '~/users/constants/user.constant';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import {
  aliasPermissionActions,
  AppAbility,
  PermissionActions,
  PermissionSubjects,
} from '../types/role.type';
import { RoomEntity } from '~/hotels/entities/room.entity';
import { BookingEntity } from '~/bookings/entities/booking.entity';

@Injectable()
export class AbilityFactory {
  constructor(
    private readonly userService: UserService,
    private readonly hotelService: HotelService,
  ) {}

  async defineAbility(user: UserEntity): Promise<AppAbility> {
    const { can, cannot, build, rules } = new AbilityBuilder<AppAbility>(createMongoAbility);
    const role = user.roleName;

    if (role === RoleTypes.ADMIN) {
      can(PermissionActions.MANAGE, 'all');
    }

    if (role === RoleTypes.HOTEL) {
      const hotel = await this.hotelService.getHotelByEmail(user.id);
      can(PermissionActions.UPDATE, HotelEntity, { email: user.id });
      can(PermissionActions.UPDATE, HotelEntity, { id: hotel.id });
      can(PermissionActions.MANAGE, RoomEntity, { hotelId: hotel.id });
      can(PermissionActions.MANAGE, RoomEntity, {
        id: { $in: hotel.rooms.map((room) => room.id) },
      });
      can(PermissionActions.READ, BookingEntity, { hotelId: hotel.id });
    }

    if (role === RoleTypes.CUSTOMER) {
      can(PermissionActions.UPDATE, CustomerEntity, { id: user.id });
      if (user.isVerified) can(PermissionActions.MANAGE, BookingEntity);
    }
    can(PermissionActions.READ, HotelEntity);
    can(PermissionActions.READ, RoomEntity);

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
