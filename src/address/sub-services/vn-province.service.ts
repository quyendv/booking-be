import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CommonUtils } from '~/base/utils/common.utils';
import AppDataSource from '~/configs/orm.config';
import { VnProvince, VnProvinceRaw } from '../types/vn-provinces.type';

@Injectable()
export class VnProvinceService {
  manager: EntityManager;

  constructor() {
    AppDataSource.initialize()
      .then(() => {
        Logger.log('Data Source has been initialized!', 'Initialize DataSource');
        this.manager = AppDataSource.manager;
      })
      .catch((err) => {
        Logger.error('Error during Data Source initialization', err);
      });
  }

  async list(): Promise<VnProvince[]> {
    const result = (await this.manager
      .createQueryBuilder()
      .select('p.code', 'provinceCode')
      // .addSelect('p.name', 'provinceName')
      .addSelect('p.full_name', 'provinceFullname')
      .addSelect('p.full_name_en', 'provinceFullnameEn')

      .addSelect('d.code', 'districtCode')
      // .addSelect('d.name', 'districtName')
      .addSelect('d.full_name', 'districtFullname')
      .addSelect('d.full_name_en', 'districtFullnameEn')

      .addSelect('w.code', 'wardCode')
      // .addSelect('w.name', 'wardName')
      .addSelect('w.full_name', 'wardFullname')
      .addSelect('w.full_name_en', 'wardFullnameEn')

      .from('provinces', 'p')
      .leftJoin('districts', 'd', 'd.province_code = p.code')
      .leftJoin('wards', 'w', 'w.district_code = d.code')
      // .orderBy('p.code')
      // .addOrderBy('d.code')
      // .addOrderBy('w.code')
      .getRawMany()) as VnProvinceRaw[];

    const provinceGroups = CommonUtils.arrayGroupBy(result, (result) => result.provinceCode);

    const provinces = Object.keys(provinceGroups).map((provinceCode) => {
      const province = provinceGroups[provinceCode][0];

      const provinceGroupItem = provinceGroups[provinceCode];
      const districtGroups = CommonUtils.arrayGroupBy(
        provinceGroupItem,
        (districtList) => districtList.districtCode,
      );

      const districts = Object.keys(districtGroups).map((districtCode) => {
        const district = districtGroups[districtCode][0];

        const districtGroupItem = districtGroups[districtCode];
        const wards = districtGroupItem.map((ward) => ({
          code: ward.wardCode,
          name: ward.wardFullname,
          nameEn: ward.wardFullnameEn,
        }));

        return {
          code: district.districtCode,
          name: district.districtFullname,
          nameEn: district.districtFullnameEn,
          wards,
        };
      });

      return {
        code: province.provinceCode,
        name: province.provinceFullname,
        nameEn: province.provinceFullnameEn,
        districts,
      };
    });
    return provinces;
  }

  // getUniversities(): Promise<any[]> {
  //   return this.manager.createQueryBuilder().select().from('universities', 'u').getRawMany();
  // }

  // async createUniversity(dto: CreateUniversityDto): Promise<InsertResult> {
  //   const existingUniversities = await this.manager
  //     .createQueryBuilder()
  //     .select()
  //     .from('universities', 'u')
  //     .where('u.name = :name', { name: dto.name })
  //     .orWhere('u.abbreviation = :abbreviation', { abbreviation: dto.abbreviation })
  //     .getRawMany();
  //   if (existingUniversities.length > 0) {
  //     throw new BadRequestException(
  //       `Name "${dto.name}" or abbreviation "${dto.abbreviation}" already exists`,
  //     );
  //   }

  //   const data = await this.manager
  //     .createQueryBuilder()
  //     .insert()
  //     .into('universities')
  //     .values({ ...dto })
  //     .returning('id')
  //     .execute();
  //   return data;
  // }
}
