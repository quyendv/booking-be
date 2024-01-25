import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '~/base/a.base.service';
import { RoleTypes } from '../constants/user.constant';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleService extends BaseService<RoleEntity> {
  constructor(@InjectRepository(RoleEntity) repository: Repository<RoleEntity>) {
    super(repository);
  }

  async getRoleByName(name: RoleTypes): Promise<RoleEntity> {
    const role = await this.findOne({ where: { name } });
    if (!role) {
      throw new InternalServerErrorException(`Role "${name}" not found. Require initialization`);
    }
    return role;
  }
}
