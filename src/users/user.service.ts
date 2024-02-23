import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { CustomerService } from '~/customers/customer.service';
import { CreateCustomerDto } from '~/customers/dto/create-customer.dto';
import { MailerService } from '~/mailer/mailer.service';
import { RoleTypes } from './constants/user.constant';
import { UserEntity } from './entities/user.entity';
import { RoleService } from './sub-services/role.service';
import { StorageFileInfo } from '~/storage/types/storage.type';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { CurrentAccountInfo } from './types/user.type';
import { UserPayload } from '~/auth/types/request.type';
import { CommonUtils } from '~/base/utils/common.utils';
import { HotelService } from '~/hotels/hotel.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
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

  async sendVerificationEmail(email: string, verifyLink: string): Promise<void> {
    Logger.log(`Sending verification email to "${email}"`, 'Start');
    await this.mailerService.sendEmail({
      content: `<div>Please verify your email address by clicking on the <a href='${verifyLink}'>link</a>.</div>`,
      to: email,
      subject: '[Booking App] Verify Your Email Address',
    });
    Logger.log(`Verification email sent to "${email}"`, 'Done');
  }

  async createUser(email: string, roleName: RoleTypes, isVerified = false): Promise<UserEntity> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`User "${email}" already exists`);
    }
    const role = await this.roleService.getRoleByName(roleName);
    return this.createOne({ id: email, isVerified, role });
  }

  async createUnverifiedCustomer(
    dto: CreateCustomerDto,
    avatarInfo?: StorageFileInfo,
  ): Promise<UserEntity> {
    const user = await this.createUser(dto.email, RoleTypes.CUSTOMER, false);
    await this.customerService.createCustomer(dto, avatarInfo);
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
