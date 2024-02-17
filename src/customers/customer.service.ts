import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { CommonUtils } from '~/base/utils/common.utils';
import { StorageFolders } from '~/storage/constants/storage.constant';
import { StorageService } from '~/storage/storage.service';
import { StorageFileInfo, StorageUploadResult } from '~/storage/types/storage.type';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { CreateCustomerDto, CreateTestCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto, UpdateCustomerInfoDto } from './dto/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity) repository: Repository<CustomerEntity>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly storageService: StorageService,
    private readonly configService: ConfigService,
  ) {
    super(repository);
  }

  async createCustomer(
    dto: CreateCustomerDto,
    avatarInfo?: StorageFileInfo,
  ): Promise<CustomerEntity> {
    let uploadResult: StorageUploadResult | null = null;
    if (avatarInfo && avatarInfo.file) {
      uploadResult = await this.storageService.upload(
        avatarInfo.file,
        avatarInfo.folder,
        avatarInfo.prefix,
      );
    }

    return this.createOne({
      id: dto.email,
      name: dto.name ?? CommonUtils.getEmailName(dto.email),
      avatar: uploadResult?.url,
      avatarKey: uploadResult?.key,
      address: dto.address ? { ...dto.address } : undefined,
    });
  }

  async updateInfo(dto: UpdateCustomerInfoDto): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: dto.email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    return this.updateOne(dto.email, {
      name: dto.name,
      birthday: dto.birthday,
      phone: dto.phone,
      gender: dto.gender,
      address: dto.address
        ? {
            id: customer.address_id || (undefined as any),
            ...dto.address,
          }
        : undefined,
    });
  }

  async updateAvatar(email: string, file: Express.Multer.File): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    const uploadResult = await this.storageService.upload(
      file,
      `${StorageFolders.CUSTOMERS}`,
      CommonUtils.getEmailName(email),
    );
    if (customer.avatarKey) await this.storageService.delete(customer.avatarKey);

    if (!uploadResult) {
      return this.updateOne(email, { avatar: null, avatarKey: null });
    }
    return this.updateOne(email, { avatar: uploadResult.url, avatarKey: uploadResult.key });
  }

  async updateCustomer(
    dto: UpdateCustomerDto,
    file: Express.Multer.File | undefined,
  ): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: dto.email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    const { email, ...data } = dto;

    let uploadResult: StorageUploadResult | null = null;
    if (file) {
      uploadResult = await this.storageService.upload(
        file,
        StorageFolders.CUSTOMERS,
        CommonUtils.getEmailName(email),
      );
      if (customer.avatarKey) await this.storageService.delete(customer.avatarKey);
    }
    return this.updateOne(email, {
      ...data,
      avatar: !file ? undefined : uploadResult ? uploadResult.url : null,
      avatarKey: !file ? undefined : uploadResult ? uploadResult.key : null,
      address: dto.address
        ? {
            id: customer.address_id || (undefined as any),
            ...dto.address,
          }
        : undefined,
    });
  }

  async createTestAccount(
    dto: CreateTestCustomerDto,
    file: Express.Multer.File | undefined,
  ): Promise<UserEntity> {
    // Create if not exists (Firebase) (with default password - not throw error if exists)
    try {
      await admin.auth().createUser({
        email: dto.email,
        password: this.configService.getOrThrow<string>(
          'environment.firebase.defaultAccountPassword',
        ),
      });
    } catch (error) {
      if (error.errorInfo?.code === 'auth/email-already-exists') {
        // throw new BadRequestException('Email already exists.');
        Logger.warn('Email already exists in Firebase.', 'CustomerService.createTestAccount');
      } else throw error;
    }

    // Create if not exists (DB) - throw error if exists
    const user = await this.userService.createUnverifiedCustomer(
      { ...dto },
      {
        file,
        folder: StorageFolders.CUSTOMERS,
        prefix: `test-${CommonUtils.getEmailName(dto.email)}`,
      },
    );
    return user;
  }
}
