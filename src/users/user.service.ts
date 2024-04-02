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
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UserPayload } from '~/auth/types/request.type';
import { BaseService } from '~/base/a.base.service';
import { CommonUtils } from '~/base/utils/common.utils';
import { CustomerService } from '~/customers/customer.service';
import { CreateCustomerDto } from '~/customers/dtos/create-customer.dto';
import { RoleTypes } from './constants/user.constant';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserHelper } from './helpers/user.helper';
import { RoleService } from './sub-services/role.service';
import { AccountInfo } from './types/user.type';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
  ) {
    super(repository);
  }

  getUserByEmail(
    email: string,
    isVerified?: boolean,
    relations?: FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity | null> {
    const condition: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] = { id: email };
    if (isVerified !== undefined) condition.isVerified = isVerified;
    return this._findOne({ where: condition, relations }); // role is eager (always populate)
  }

  async createUser({
    email,
    roleName,
    isVerified = false,
    shouldCreateFirebaseUser = false,
  }: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException(`User "${email}" already exists`);
    }
    const role = await this.roleService.getRoleByName(roleName);
    const user = await this._createOne({ id: email, isVerified, role });
    if (shouldCreateFirebaseUser) await this.createFirebaseUser(email);
    return user;
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

  private async deleteFirebaseUser(email: string): Promise<void> {
    try {
      const { uid } = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(uid); // deleteUsers([uid])
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
  async createUnverifiedCustomer(
    dto: CreateCustomerDto,
    shouldCreateFirebaseUser = false,
  ): Promise<UserEntity> {
    const user = await this.createUser({
      email: dto.email,
      roleName: RoleTypes.CUSTOMER,
      isVerified: false,
      shouldCreateFirebaseUser,
    });
    await this.customerService._createOne({
      ...dto,
      id: dto.email,
      name: dto.name ?? CommonUtils.getEmailName(dto.email),
      userId: user.id,
    });
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
    return this._updateOne(user.id, { isVerified: true });
  }

  async getCurrentInfo(payload: UserPayload, isVerified?: boolean): Promise<AccountInfo> {
    const user = await this.getUserByEmail(payload.email, isVerified, {
      hotelManager: true,
      customer: true,
      receptionist: true,
    });
    if (!user) throw new NotFoundException(`User ${payload.email} not found`);
    return UserHelper.transformAccountInfo(user, payload);
  }

  async listAccountInfo(): Promise<AccountInfo[]> {
    const users = await this._findAll({
      // where: { role: { name: Not(RoleTypes.ADMIN) } },
      relations: { customer: true, hotelManager: true, receptionist: true },
    });
    return users.map((user) => UserHelper.transformAccountInfo(user));
  }

  async deleteAccount(email: string): Promise<void> {
    await this._permanentDelete(email);
    await this.deleteFirebaseUser(email);
  }

  async deleteAccounts(emails: string[]): Promise<void> {
    try {
      await this._permanentDelete(emails);
      const { users /*, notFound */ } = await admin
        .auth()
        .getUsers(emails.map((email) => ({ email })));
      await admin.auth().deleteUsers(users.map((user) => user.uid));
    } catch (error) {
      if (error.errorInfo?.code === 'auth/user-not-found') {
        Logger.warn('User not found in Firebase.', 'UserService.deleteFirebaseUser');
      } else throw error;
    }
  }
}
