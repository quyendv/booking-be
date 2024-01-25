import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '~/mailer/mailer.module';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';
import { RoleService } from './sub-services/role.service';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity]), MailerModule],
  providers: [UserService, RoleService],
  exports: [UserService],
})
export class UserModule {}
