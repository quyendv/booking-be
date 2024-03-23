import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from '~/address/address.module';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistService } from './receptionist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceptionistEntity]), AddressModule],
  controllers: [ReceptionistController],
  providers: [ReceptionistService],
  exports: [ReceptionistService],
})
export class ReceptionistModule {}
