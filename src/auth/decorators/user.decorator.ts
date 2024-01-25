import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ParseUserPipe } from '../pipes/user.pipe';
import { RequestWithUser } from '../types/request.type';

export const AuthUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<RequestWithUser>();
  return request.user;
});

export const GetUser = (additionalOptions?: any): ParameterDecorator =>
  AuthUser(additionalOptions, ParseUserPipe);
