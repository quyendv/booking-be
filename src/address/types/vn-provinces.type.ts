type BaseUnitType = {
  code: string;
  name: string;
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
  districtCode: string;
  districtFullname: string;
  wardCode: string;
  wardFullname: string;
}
