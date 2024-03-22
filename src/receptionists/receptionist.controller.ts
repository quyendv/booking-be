import { Controller } from '@nestjs/common';
import { ReceptionistService } from './receptionist.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('receptionists')
@Controller('receptionists')
export class ReceptionistController {
  constructor(private readonly receptionistService: ReceptionistService) {}
}
