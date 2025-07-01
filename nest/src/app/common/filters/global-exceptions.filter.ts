import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from 'src/app/modules/log/services/log.service';
import { LoggerActions } from 'src/config/logger.config';

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    this.logService.log({
      type: LoggerActions.ERROR,
      message: `[HTTP ERROR] ${request.method} ${request.url} | Status: ${status} | Message: ${message}`,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
