import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, In, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { CommonUtils } from '~/base/utils/common.utils';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { CustomerEntity } from './entities/customer.entity';
import { AddressService } from '~/address/address.service';
import { BaseResponse } from '~/base/types/response.type';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity) private readonly repository: Repository<CustomerEntity>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {
    super(repository);
  }

  async getCustomerByEmail(
    email: string,
    options?: FindOneOptions<CustomerEntity>,
  ): Promise<CustomerEntity> {
    const customer = await this.findById(email, options);
    if (!customer) throw new NotFoundException('Customer not found.');
    return customer;
  }

  async createTestCustomerAccount(dto: CreateCustomerDto): Promise<UserEntity> {
    return this.userService.createUnverifiedCustomer(dto, true);
  }

  async updateCustomer(dto: UpdateCustomerDto): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: dto.email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    const { email, ...data } = dto;

    return this.updateOne(email, {
      ...data,
      address:
        dto.address && customer.addressId
          ? { id: customer.addressId, ...dto.address }
          : dto.address,
    });
  }

  async deleteCustomer(emails: string[]): Promise<BaseResponse> {
    const users = await this.userService.findAll({
      where: { id: In(emails), isVerified: false },
      relations: { customer: true },
    });
    if (users.length !== emails.length) {
      throw new NotFoundException('Some unverified customers not found.');
    }

    const addressIds = users.map((user) => user.customer?.addressId).filter((id) => id);
    await this.repository.delete(emails);
    if (addressIds.length > 0) await this.addressService.permanentDeleteMany(addressIds);

    await this.userService.deleteAccounts(emails);
    return { status: 'success', message: 'Deleted successfully.' };
  }

  // async updateInfo(dto: UpdateCustomerInfoDto): Promise<CustomerEntity> {
  //   const customer = await this.findOne({ where: { id: dto.email } });
  //   if (!customer) throw new NotFoundException('Customer not found to update.');

  //   return this.updateOne(dto.email, {
  //     name: dto.name,
  //     birthday: dto.birthday,
  //     phone: dto.phone,
  //     gender: dto.gender,
  //     address: dto.address
  //       ? {
  //           id: customer.addressId || (undefined as any),
  //           ...dto.address,
  //         }
  //       : undefined,
  //   });
  // }

  // async updateAvatar(email: string, file: Express.Multer.File): Promise<CustomerEntity> {
  //   const customer = await this.findOne({ where: { id: email } });
  //   if (!customer) throw new NotFoundException('Customer not found to update.');

  //   const uploadResult = await this.storageService.uploadFile(
  //     file,
  //     `${StorageFolders.CUSTOMERS}`,
  //     CommonUtils.getEmailName(email),
  //   );
  //   if (customer.avatarKey) await this.storageService.delete(customer.avatarKey);

  //   if (!uploadResult) {
  //     return this.updateOne(email, { avatar: null, avatarKey: null });
  //   }
  //   return this.updateOne(email, { avatar: uploadResult.url, avatarKey: uploadResult.key });
  // }

  // async updateCustomer(
  //   dto: UpdateCustomerDto,
  //   file: Express.Multer.File | undefined,
  // ): Promise<CustomerEntity> {
  //   const customer = await this.findOne({ where: { id: dto.email } });
  //   if (!customer) throw new NotFoundException('Customer not found to update.');

  //   const { email, ...data } = dto;

  //   let uploadResult: StorageUploadResult | null = null;
  //   if (file) {
  //     uploadResult = await this.storageService.uploadFile(
  //       file,
  //       StorageFolders.CUSTOMERS,
  //       CommonUtils.getEmailName(email),
  //     );
  //     if (customer.avatarKey) await this.storageService.delete(customer.avatarKey);
  //   }
  //   return this.updateOne(email, {
  //     ...data,
  //     avatar: !file ? undefined : uploadResult ? uploadResult.url : null,
  //     avatarKey: !file ? undefined : uploadResult ? uploadResult.key : null,
  //     address: dto.address
  //       ? {
  //           id: customer.addressId || (undefined as any),
  //           ...dto.address,
  //         }
  //       : undefined,
  //   });
  // }
}
