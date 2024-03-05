import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '~/customers/customer.module';
import { HotelModule } from '~/hotels/hotel.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingEntity } from './entities/booking.entity';
import { PaymentService } from './sub-service/payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity]), HotelModule, CustomerModule],
  controllers: [BookingController],
  providers: [BookingService, PaymentService],
  exports: [BookingService],
})
export class BookingModule {}
