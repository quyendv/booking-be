import { Exclude, Expose } from 'class-transformer';
import { HotelEntity } from '../entities/hotel.entity';
import { RoomEntity } from '../entities/room.entity';
import { ReviewEntity } from '~/reviews/entities/review.entity';

type HotelOverview = {
  rooms: {
    total: number;
    minPrice: number | null;
  };
  reviews: {
    total: number;
    average: number;
  };
};

export class HotelOverviewDto extends HotelEntity {
  @Expose()
  get overview(): HotelOverview {
    return {
      rooms: {
        total: this.rooms.length,
        minPrice:
          this.rooms.length === 0 ? null : Math.min(...this.rooms.map((room) => room.roomPrice)),
      },
      reviews: {
        total: this.reviews.length,
        average:
          this.reviews.length === 0
            ? 0
            : this.reviews.reduce((acc, curr) => acc + curr.total, 0) / this.reviews.length,
      },
    };
  }

  @Exclude({ toPlainOnly: true })
  rooms: RoomEntity[];

  @Exclude({ toPlainOnly: true })
  reviews: ReviewEntity[];
}
