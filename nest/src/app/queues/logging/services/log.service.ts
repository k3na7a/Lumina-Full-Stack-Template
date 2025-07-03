import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LOG_DLQ, LOG_QUEUE } from 'src/app/config/logger.config';
import { jobtype } from 'src/library/interfaces/logger.interface';

@Injectable()
export class LogService {
  constructor(
    @InjectQueue(LOG_QUEUE)
    public readonly logQueue: Queue<jobtype>,
    @InjectQueue(LOG_DLQ)
    public readonly deadLetterQueue: Queue,
  ) {}

  async log(payload: jobtype) {
    await this.logQueue.add(LOG_QUEUE, payload);
  }
}
