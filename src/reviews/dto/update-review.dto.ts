import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['bookingId'] as const),
) {}
