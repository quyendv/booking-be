import { UserPayload } from '~/auth/types/request.type';
import { RoleTypes } from '../constants/user.constant';
import { UserEntity } from '../entities/user.entity';
import { AccountInfo } from '../types/user.type';
import { CommonUtils } from '~/base/utils/common.utils';
import { InternalServerErrorException } from '@nestjs/common';

export class UserHelper {
  static transformAccountInfo(user: UserEntity, currentPayload?: UserPayload): AccountInfo {
    if (user.roleName === RoleTypes.ADMIN) {
      return {
        id: user.id,
        email: user.id,
        isVerified: user.isVerified,
        role: user.roleName,
        avatar: currentPayload?.picture,
        name: currentPayload?.name ?? CommonUtils.getEmailName(user.id),
      };
    }
    if (user.roleName === RoleTypes.CUSTOMER) {
      return {
        id: user.customer.id,
        email: user.id,
        name: user.customer.name,
        role: user.roleName,
        isVerified: user.isVerified,
        avatar: user.customer.avatar ?? undefined,
      };
    }
    if (user.roleName === RoleTypes.HOTEL_MANAGER) {
      return {
        id: user.hotelManager.hotel.id,
        email: user.id,
        name: user.hotelManager.name,
        role: user.roleName,
        isVerified: user.isVerified,
        avatar: user.hotelManager.avatar ?? undefined,
      };
    }
    if (user.roleName === RoleTypes.RECEPTIONIST) {
      return {
        id: user.receptionist.id,
        email: user.id,
        name: user.receptionist.name,
        role: user.roleName,
        isVerified: user.isVerified,
        avatar: user.receptionist.avatar ?? undefined,
      };
    }
    throw new InternalServerErrorException(`Role "${user.roleName}" is not supported`);
  }
}
