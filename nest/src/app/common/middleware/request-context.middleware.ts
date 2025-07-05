import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'src/plugins/nanoid.plugin';
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
      requestId: nanoid(),
      ipAddress: req.ip,
    };

    this.requestContext.run(store, next);
  }
}
