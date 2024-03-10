import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '~/customers/customer.module';
import { HotelModule } from '~/hotels/hotel.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingEntity } from './entities/booking.entity';
import { PaymentService } from './sub-service/payment.service';
import { ReviewEntity } from './entities/review.entity';
import { ReviewService } from './sub-service/review.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity, ReviewEntity]), HotelModule, CustomerModule],
  controllers: [BookingController],
  providers: [BookingService, PaymentService, ReviewService],
  exports: [BookingService],
})
export class BookingModule {}
