import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/library/enums/logger-actions.enum';

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const debug = false;
    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest<Request>();
    const response = httpCtx.getResponse<Response>();

    const { method, originalUrl } = request;

    const startedAt = Date.now();

    return next.handle().pipe(
      tap(async () => {
        const statusCode = response.statusCode;
        const duration = Date.now() - startedAt;

        if (debug)
          await this.logService.log({
            type: LoggerActions.INFO,
            message: {
              method: method,
              url: originalUrl,
              status: statusCode,
              duration: `${duration}ms`,
            },
            context: HttpInterceptor.name,
          });
      }),
    );
  }
}
