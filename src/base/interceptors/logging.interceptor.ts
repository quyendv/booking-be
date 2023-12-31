import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startAt = process.hrtime();

    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const className = context.getClass().name;
    const handlerName = context.getHandler().name;

    const logger = new Logger(`${className} - ${handlerName}`);

    response.on('close', () => {
      const { ip, method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const userAgent = request.get('user-agent') || '';
      const diff = process.hrtime(startAt);
      const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} ${responseTime}ms - ${userAgent} ${ip}`;

      logger.verbose(message);
    });

    return next.handle();
  }
}
