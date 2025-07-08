import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { LoggerQueues } from 'src/library/enums/logger-actions.enum';

import { emailProps } from 'src/plugins/sendgrid.plugin';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('cleanup-queue')
    public readonly cleanupQueue: Queue<emailProps>,
    @InjectQueue('cleanup-dlq')
    public readonly deadLetterQueue: Queue,
  ) {}

  async cleanup(payload: emailProps) {
    await this.cleanupQueue.add(LoggerQueues.LOG_QUEUE, payload);
  }
}
