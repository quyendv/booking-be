type BaseUnitType = {
  code: string;
  name: string;
  nameEn: string;
};

export type VnWard = BaseUnitType;

export type VnDistrict = BaseUnitType & {
  wards: VnWard[];
};

export type VnProvince = BaseUnitType & {
  districts: VnDistrict[];
};

export interface VnProvinceRaw {
  provinceCode: string;
  provinceFullname: string;
  provinceFullnameEn: string;
  districtCode: string;
  districtFullname: string;
  districtFullnameEn: string;
  wardCode: string;
  wardFullname: string;
  wardFullnameEn: string;
}
