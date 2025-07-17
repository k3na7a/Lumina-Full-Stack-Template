import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/app/queues/logging/enums/logger-actions.enum';

@Catch(HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logService: LogService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      message = String(exception);
    }

    await this.logService.log({
      type: LoggerActions.ERR,
      context: GlobalExceptionFilter.name,
      message: {
        method: request.method,
        url: request.url,
        status: status,
        exception: message,
        ...(exception instanceof Error && { stack: exception.stack }),
      },
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
