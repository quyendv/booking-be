// import { ForbiddenError } from '@casl/ability';
import { ForbiddenError } from '@casl/ability';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpExceptionBody,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private showLogDetails: boolean;

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {
    this.showLogDetails = true;
  }

  catch(exception: CommonException, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse();

    this.handleLogException(exception);
    this.handleResponse(request, response, exception);
  }

  private handleResponse(request: Request, response: Response, exception: CommonException): void {
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: HttpExceptionBody | object = {
      message: INTERNAL_SERVER_ERROR_MSG,
      statusCode,
    };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      responseBody =
        typeof exceptionResponse === 'string'
          ? { statusCode, message: exceptionResponse }
          : exceptionResponse;
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode,
        message: exception.message,
        error: this.showLogDetails ? exception.stack : exception.message,
      };
    } else if (exception instanceof ForbiddenError) {
      statusCode = HttpStatus.FORBIDDEN;
      responseBody = {
        statusCode,
        message: exception.message,
      };
    } else if (exception instanceof Error) {
      responseBody = {
        statusCode: statusCode,
        message: this.showLogDetails ? exception.stack : exception.message,
      };
    }
    // response.status(statusCode).json(responseBody);
    this.httpAdapterHost.httpAdapter.reply(
      response,
      { ...responseBody, timestamp: new Date(), path: request.url },
      statusCode,
    );
  }

  private handleLogException(exception: CommonException): void {
    // this.logger.error(exception, exception.stack, 'TraceDetails');
    Logger.error(exception, exception.stack, 'Exception Filter');
  }
}

type CommonException = HttpException | QueryFailedError | ForbiddenError<any> | Error;

const INTERNAL_SERVER_ERROR_MSG = 'Internal Server Error';
