import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateHotelDto } from './create-hotel.dto';

export class UpdateHotelDto extends PartialType(OmitType(CreateHotelDto, ['email'])) {} // require imageUrl if imageKey truthy
