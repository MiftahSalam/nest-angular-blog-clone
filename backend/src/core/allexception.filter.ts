import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PresenterOutput } from './presenter';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const presenter: PresenterOutput = {
      status: httpStatus,
      message:
        exception instanceof HttpException ? exception.message : 'Server error',
      data: {},
    };
    Logger.error(
      `${request.method} ${request.url}`,
      httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.stack
        : exception.message,
      'HttpExceptionFilter',
    );
    httpAdapter.reply(ctx.getResponse(), presenter, httpStatus);
  }
}
