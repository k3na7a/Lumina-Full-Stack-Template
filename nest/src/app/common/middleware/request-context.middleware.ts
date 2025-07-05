import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';
import { RequestContext } from '../providers/request-context.provider';

export interface RequestContextStore {
  requestId: string;
  userId?: string;
  ipAddress?: string;
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContext) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const store: RequestContextStore = {
      requestId: randomUUID(),
      ipAddress: req.ip,
      userId: undefined,
    };

    this.requestContext.run(store, next);
  }
}
