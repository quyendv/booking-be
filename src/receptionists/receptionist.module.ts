import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceptionistController } from './receptionist.controller';
import { ReceptionistEntity } from './entities/receptionist.entity';
import { ReceptionistService } from './receptionist.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReceptionistEntity])],
  controllers: [ReceptionistController],
  providers: [ReceptionistService],
  exports: [ReceptionistService],
})
export class ReceptionistModule {}
