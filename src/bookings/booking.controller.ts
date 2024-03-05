import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingEntity } from './entities/booking.entity';
import { ApiTags } from '@nestjs/swagger';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AuthGuard } from '~/auth/guards/auth.guard';
import { RolesGuard } from '~/auth/guards/role.guard';
import { Roles } from '~/auth/decorators/role.decorator';
import { PermissionActions } from '~/auth/types/role.type';
import { AuthUser } from '~/auth/decorators/user.decorator';
import { UserPayload } from '~/auth/types/request.type';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard, RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  listBookings(): Promise<BookingEntity[]> {
    return this.bookingService.findAll();
  }

  @Post()
  @Roles([PermissionActions.CREATE, BookingEntity])
  createBooking(
    @AuthUser() user: UserPayload,
    @Body() body: CreateBookingDto,
  ): Promise<BookingEntity> {
    return this.bookingService.createBooking(body, user.email);
  }
}
