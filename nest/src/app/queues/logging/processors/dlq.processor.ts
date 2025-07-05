import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { LoggerQueues } from 'src/library/enums/logger-actions.enum';
import { jobtype } from 'src/library/interfaces/logger.interface';

@Processor(LoggerQueues.LOG_DLQ)
export class DeadLetterQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(DeadLetterQueueProcessor.name);

  async process(job: Job<jobtype>) {
    this.logger.warn(
      `{${LoggerQueues.LOG_DLQ}} Handling DLQ job: ID=${job.id}`,
    );
  }

  async onApplicationShutdown() {
    await Promise.allSettled([this.worker.close()]);
  }
}
