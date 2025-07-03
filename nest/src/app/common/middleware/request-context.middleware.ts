import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContext } from '../providers/request-context.provider';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContext) {}

  use(req: Request, res: Response, next: NextFunction) {
    const store = {
      requestId: randomUUID(),
      userId: undefined,
      ipAddress: req.ip,
    };

    this.requestContext.run(store, next);
  }
}
