import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { RequestContext } from 'src/app/common/providers/request-context.provider';
import { LoggerQueues } from 'src/app/queues/logging/enums/logger-actions.enum';

import { jobtype } from 'src/app/common/interfaces/logger.interface';

@Injectable()
export class LogService {
  constructor(
    @InjectQueue(LoggerQueues.LOG_QUEUE)
    public readonly logQueue: Queue<jobtype>,
    @InjectQueue(LoggerQueues.LOG_DLQ)
    public readonly deadLetterQueue: Queue,
    public readonly requestContext: RequestContext,
  ) {}

  async log(payload: jobtype) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { request: _req, ...requestInfo } = this.requestContext.getStore() ?? {};

    await this.logQueue.add(LoggerQueues.LOG_QUEUE, {
      ...payload,
      requestInfo,
    });
  }
}
