import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  bookingId: string;

  // @IsNotEmpty()
  // @IsNumber()
  // roomId: number;

  // @IsNotEmpty()
  // @IsNumber()
  // hotelId: number;

  // @IsNotEmpty()
  // @IsString()
  // customerEmail: string;

  // @IsNotEmpty()
  // @IsString()
  // customerName: string;

  // @IsOptional()
  // @IsString()
  // customerImage: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5) // TODO: multiple of 0.5
  staffRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  facilityRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  cleanlinessRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  comfortRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  valueForMoneyRating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  locationRating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  // reviewImages: string[];
}
