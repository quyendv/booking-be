import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { UserService } from '~/users/user.service';
import { CreateReceptionistDto } from './dto/create-receptionist.dto';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { CommonUtils } from '~/base/utils/common.utils';
import { RoleTypes } from '~/users/constants/user.constant';
import { UpdateReceptionistDto } from './dto/update-receptionist.dto';

@Injectable()
export class ReceptionistService extends BaseService<ReceptionistEntity> {
  constructor(
    @InjectRepository(ReceptionistEntity) repository: Repository<ReceptionistEntity>,
    private readonly userService: UserService,
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
    const { email, ...otherData } = dto;

    await this.userService.createUser(email, RoleTypes.RECEPTIONIST, true);
    await this.userService.createFirebaseUser(email);
    return this.createOne({
      ...otherData,
      id: email,
      name: dto.name ?? CommonUtils.getEmailName(email),
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

  async deleteReceptionist(email: string): Promise<void> {
    const receptionist = await this.findOne({ where: { id: email } });
    if (!receptionist) throw new NotFoundException('Receptionist not found to delete.');

    await this.userService.permanentDelete(email);
    // await this.userService.deleteFirebaseUser(email);
    // TODO: delete storage avatar
    await this.permanentDelete(email);
  }
}
