import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { RequestWithUser } from '../types/request.type';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});

// export const GetUser = (additionalOptions?: any): ParameterDecorator =>
//   AuthUser(additionalOptions, ParseUserPipe);

/** Move to ~/auth/pipes/parse-user.pipe.ts */
// @Injectable()
// export class ParseUserPipe implements PipeTransform {
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   constructor(/* private usersService: UsersService */) {}

//   async transform(value: UserPayload, metadata: ArgumentMetadata): Promise<UserEntity> {
//     return this.usersService.getUserByEmail(value.email);
//   }
// }
