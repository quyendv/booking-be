import { OmitType } from '@nestjs/swagger';
import { CreateReceptionistDto } from './create-receptionist.dto';

export class UpdateReceptionistDto extends OmitType(CreateReceptionistDto, ['hotelId']) {}
