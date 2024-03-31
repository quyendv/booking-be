import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { UserService } from '~/users/user.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { CommonUtils } from '~/base/utils/common.utils';
import { RoleTypes } from '~/users/constants/user.constant';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';
import { AddressService } from '~/address/address.service';
import { BaseResponse } from '~/base/types/response.type';

@Injectable()
export class ReceptionistService extends BaseService<ReceptionistEntity> {
  constructor(
    @InjectRepository(ReceptionistEntity) repository: Repository<ReceptionistEntity>,
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {
    super(repository);
  }

  async getReceptionistById(
    id: string,
    relations?: FindOptionsRelations<ReceptionistEntity>,
  ): Promise<ReceptionistEntity> {
    const receptionist = await this.findById(id, { relations: relations });
    if (!receptionist) throw new NotFoundException('Receptionist not found');
    return receptionist;
  }

  async createReceptionist(dto: CreateReceptionistDto): Promise<ReceptionistEntity> {
    const user = await this.userService.createUser({
      email: dto.email,
      roleName: RoleTypes.RECEPTIONIST,
      isVerified: true,
      shouldCreateFirebaseUser: true,
    });
    return this.createOne({
      ...dto,
      id: dto.email,
      name: dto.name ?? CommonUtils.getEmailName(dto.email),
      userId: user.id,
    });
  }

  async updateReceptionist(dto: UpdateReceptionistDto): Promise<ReceptionistEntity> {
    const receptionist = await this.findOne({ where: { id: dto.email } });
    if (!receptionist) throw new NotFoundException('Receptionist not found to update.');

    const { email, ...data } = dto;

    return this.updateOne(email, {
      ...data,
      address:
        dto.address && receptionist.addressId
          ? { id: receptionist.addressId, ...dto.address }
          : dto.address,
    });
  }

  async deleteReceptionist(email: string): Promise<BaseResponse> {
    const receptionist = await this.findOne({ where: { id: email } });
    if (!receptionist) throw new NotFoundException('Receptionist not found to delete.');

    await this.permanentDelete(email);
    if (receptionist.addressId) {
      await this.addressService.permanentDelete(receptionist.addressId);
    }
    // TODO: delete storage file

    await this.userService.deleteAccount(email);

    return { status: 'success', message: 'Receptionist deleted successfully' };
  }
}
