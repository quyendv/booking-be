import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserPayload } from '~/auth/types/request.type';
import { BaseService } from '~/base/a.base.service';
import { CommonUtils } from '~/base/utils/common.utils';
import { CustomerService } from '~/customers/customer.service';
import { CreateCustomerDto } from '~/customers/dto/create-customer.dto';
import { HotelService } from '~/hotels/hotel.service';
import { RoleTypes } from './constants/user.constant';
import { UserEntity } from './entities/user.entity';
import { RoleService } from './sub-services/role.service';
import { CurrentAccountInfo } from './types/user.type';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
    @Inject(forwardRef(() => CustomerService)) private readonly hotelService: HotelService,
  ) {
    super(repository);
  }

  getUserByEmail(email: string, isVerified?: boolean): Promise<UserEntity | null> {
    const condition: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] = { id: email };
    if (isVerified !== undefined) condition.isVerified = isVerified;
    return this.findOne({ where: condition }); // role is eager (always populate)
  }

  async createUser(email: string, roleName: RoleTypes, isVerified = false): Promise<UserEntity> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`User "${email}" already exists`);
    }
    const role = await this.roleService.getRoleByName(roleName);
    return this.createOne({ id: email, isVerified, role });
  }

  async createFirebaseUser(email: string, password?: string): Promise<void> {
    try {
      await admin.auth().createUser({
        email,
        password:
          password ??
          this.configService.getOrThrow<string>('environment.firebase.defaultAccountPassword'),
      });
    } catch (error) {
      if (error.errorInfo?.code === 'auth/email-already-exists') {
        // throw new BadRequestException('Email already exists.');
        Logger.warn('Email already exists in Firebase.', 'UserService.createFirebaseUser');
      } else throw error;
    }
  }

  async deleteFirebaseUser(email: string): Promise<void> {
    try {
      const { uid } = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(uid);
    } catch (error) {
      if (error.errorInfo?.code === 'auth/user-not-found') {
        // throw new NotFoundException('User not found.');
        Logger.warn('User not found in Firebase.', 'UserService.deleteFirebaseUser');
      } else throw error;
    }
  }

  /**
   * Sign Up Customer
   */
  async createUnverifiedCustomer(dto: CreateCustomerDto): Promise<UserEntity> {
    const user = await this.createUser(dto.email, RoleTypes.CUSTOMER, false);
    await this.customerService.createCustomer(dto);
    return user;
  }

  async verifyCustomer(email: string): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new InternalServerErrorException(
        `Unverified user "${email}" was not created before verifying`,
      );
    }
    if (user.isVerified) {
      throw new BadRequestException(`User "${email}" has already been verified`);
    }
    return this.updateOne(user.id, { isVerified: true });
  }

  async getCurrentInfo(payload: UserPayload): Promise<CurrentAccountInfo> {
    const user = await this.getUserByEmail(payload.email);
    if (!user) throw new NotFoundException(`User ${payload.email} not found`);
    if (user.roleName === RoleTypes.ADMIN) {
      return {
        id: user.id,
        email: user.id,
        isVerify: user.isVerified,
        role: user.roleName,
        avatar: payload.picture,
        name: payload.name ?? CommonUtils.getEmailName(payload.email),
      };
    }
    if (user.roleName === RoleTypes.CUSTOMER) {
      const customer = await this.customerService.getCustomerByEmail(payload.email);
      return {
        id: customer.id,
        email: user.id,
        name: customer.name,
        role: user.roleName,
        isVerify: user.isVerified,
        avatar: customer.avatar ?? undefined,
      };
    }
    if (user.roleName === RoleTypes.HOTEL) {
      const hotel = await this.hotelService.getHotelByEmail(payload.email);
      return {
        id: hotel.id,
        email: user.id,
        name: hotel.name,
        role: user.roleName,
        isVerify: user.isVerified,
        avatar: hotel.imageUrl ?? undefined,
      };
    }
    throw new InternalServerErrorException(`Role "${user.roleName}" is not supported`);
  }
}
