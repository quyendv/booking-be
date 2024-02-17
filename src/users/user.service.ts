import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { UserPayload } from '~/auth/types/request.type';
import { BaseService } from '~/base/a.base.service';
import { CustomerService } from '~/customers/customer.service';
import { MailerService } from '~/mailer/mailer.service';
import { RoleTypes } from './constants/user.constant';
import { UserEntity } from './entities/user.entity';
import { RoleService } from './sub-services/role.service';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) repository: Repository<UserEntity>,
    private readonly mailerService: MailerService,
    private readonly roleService: RoleService,
    private readonly customerService: CustomerService,
  ) {
    super(repository);
  }

  getUserByEmail(email: string, isVerified?: boolean): Promise<UserEntity | null> {
    const condition: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] = { id: email };
    if (isVerified !== undefined) condition.isVerified = isVerified;
    return this.findOne({ where: condition }); // role is eager (always populate)
  }

  async sendVerificationEmail(email: string, verifyLink: string): Promise<void> {
    Logger.log(`Sending verification email to "${email}"`, 'Start');
    await this.mailerService.sendEmail({
      content: `<div>Please verify your email address by clicking on the <a href='${verifyLink}'>link</a>.</div>`,
      to: email,
      subject: '[Booking App] Verify Your Email Address',
    });
    Logger.log(`Verification email sent to "${email}"`, 'Done');
  }

  async signUpCustomer(payload: UserPayload): Promise<UserEntity> {
    const role = await this.roleService.getRoleByName(RoleTypes.CUSTOMER);
    await this.customerService.createOne({
      id: payload.email,
      name: payload.name,
      avatar: payload.picture,
    });
    return this.createOne({ id: payload.email, isVerified: false, role });
  }

  async verifyCustomer(email: string): Promise<UserEntity> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new InternalServerErrorException(
        `Unverified user "${email}" was not created before verifying`,
      );
    }
    if (user.isVerified) {
      throw new BadRequestException(`User "${email}" has already been verified`);
    }
    return this.updateOne(user.id, { isVerified: true });
  }
}
