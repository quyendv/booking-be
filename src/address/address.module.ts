import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { VnProvinceService } from './sub-services/vn-province.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressController],
  providers: [AddressService, VnProvinceService],
  exports: [AddressService],
})
export class AddressModule {}
