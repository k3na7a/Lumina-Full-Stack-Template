import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RequestContext } from '../providers/request-context.provider';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(private readonly requestContext: RequestContext) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const store = this.requestContext.getStore();

    if (store && req.user) {
      store.userId = req.user.id;
    }

    return next.handle();
  }
}
