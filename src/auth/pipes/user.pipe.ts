import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UserEntity } from '~/users/entities/user.entity';
import { UserService } from '~/users/user.service';
import { UserPayload } from '../types/request.type';

@Injectable()
export class ParseUserPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: UserPayload, metadata: ArgumentMetadata): Promise<UserEntity> {
    const user = await this.userService.getUserByEmail(value.email, true);
    if (!user) {
      throw new NotFoundException(`Verified user "${value.email}" not found`);
    }
    return user;
  }
}
