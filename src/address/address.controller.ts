import { Controller, Get, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { VnProvinceService } from './sub-services/vn-province.service';
import { VnProvince } from './types/vn-provinces.type';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { Public } from '~/auth/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '~/auth/guards/role.guard';

@ApiTags('Address')
@Controller('addresses')
@UseGuards(AuthGuard, RolesGuard)
export class AddressController {
  constructor(
    private readonly vnProvinceService: VnProvinceService,
    private readonly addressService: AddressService,
  ) {}

  @Public()
  @Get('provinces/vn')
  async getVnProvinces(): Promise<VnProvince[]> {
    return this.vnProvinceService.list();
  }
}
