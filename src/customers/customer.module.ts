import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { CustomerEntity } from './entities/customer.entity';
import { AddressModule } from '~/address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity]), AddressModule],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
