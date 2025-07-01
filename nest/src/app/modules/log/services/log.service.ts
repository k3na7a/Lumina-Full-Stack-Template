import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { jobtype, LOG_QUEUE } from 'src/config/logger.config';

@Injectable()
export class LogService {
  constructor(
    @InjectQueue(LOG_QUEUE)
    public readonly logQueue: Queue<jobtype>,
  ) {
    this.init();
  }

  private async init() {
    const client = await this.logQueue.client;
    client.on('connect', () => {
      Logger.log('[BullMQ] Connected to Redis!');
    });
    client.on('error', (err) => {
      Logger.error('[BullMQ] Redis connection error:', err);
    });
  }

  async log(payload: jobtype) {
    await this.logQueue.add(LOG_QUEUE, payload);
  }
}
