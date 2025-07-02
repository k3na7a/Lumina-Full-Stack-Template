import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { jobtype, LOG_DLQ, LOG_QUEUE } from 'src/config/logger.config';

@Injectable()
export class LogService {
  constructor(
    @InjectQueue(LOG_QUEUE)
    public readonly logQueue: Queue<jobtype>,
    @InjectQueue(LOG_DLQ)
    public readonly deadLetterQueue: Queue,
  ) {}

  async log(payload: jobtype) {
    await this.logQueue.add(LOG_QUEUE, payload, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: true,
    });
  }
}
