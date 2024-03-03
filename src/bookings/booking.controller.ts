import { Controller, Get } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingEntity } from './entities/booking.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  listBookings(): Promise<BookingEntity[]> {
    return this.bookingService.findAll();
  }
}
