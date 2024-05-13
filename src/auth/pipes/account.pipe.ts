import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AccountInfo } from '~/users/types/user.type';
import { UserService } from '~/users/user.service';
import { UserPayload } from '../types/request.type';

@Injectable()
export class ParseAccountInfoPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: UserPayload, metadata: ArgumentMetadata): Promise<AccountInfo> {
    const user = await this.userService.getCurrentInfo(value);
    return user;
  }
}
