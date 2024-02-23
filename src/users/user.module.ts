import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '~/customers/customer.module';
import { MailerModule } from '~/mailer/mailer.module';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { RoleService } from './sub-services/role.service';
import { UserService } from './user.service';
import { HotelModule } from '~/hotels/hotel.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    MailerModule,
    CustomerModule,
    HotelModule,
  ],
  providers: [UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
