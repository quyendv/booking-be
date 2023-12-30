import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestWithUser } from '../types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    req.user = await this.authService.authenticate(req.headers.authorization);
    return true;
  }
}
