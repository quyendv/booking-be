import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerEntity } from './entities/customer.entity';
import { BaseService } from '~/base/a.base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UpdateCustomerInfoDto } from './dto/update-customer.dto';
import { StorageService } from '~/storage/storage.service';
import { CommonUtils } from '~/base/utils/common.utils';

@Injectable()
export class CustomerService extends BaseService<CustomerEntity> {
  constructor(
    @InjectRepository(CustomerEntity) repository: Repository<CustomerEntity>,
    private readonly storageService: StorageService,
  ) {
    super(repository);
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
            id: customer.address_id | (undefined as any),
            details: dto.address.details,
            district: dto.address.district,
            province: dto.address.province,
            country: dto.address.country,
          }
        : undefined,
    });
  }

  async updateAvatar(email: string, file: Express.Multer.File): Promise<CustomerEntity> {
    const customer = await this.findOne({ where: { id: email } });
    if (!customer) throw new NotFoundException('Customer not found to update.');

    const uploadResult = await this.storageService.upload(
      file,
      `customers/${CommonUtils.getEmailName(email)}`,
    );

    if (!uploadResult) {
      return this.updateOne(email, { avatar: null, avatarKey: null });
    }
    return this.updateOne(email, { avatar: uploadResult.url, avatarKey: uploadResult.key });
  }
}
