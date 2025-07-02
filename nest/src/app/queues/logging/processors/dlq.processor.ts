// dead-letter-queue.processor.ts

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { jobtype, LOG_DLQ } from 'src/config/logger.config';

@Processor(LOG_DLQ)
export class DeadLetterQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(DeadLetterQueueProcessor.name);

  async process(job: Job<jobtype>) {
    this.logger.warn(
      `[DLQ Processor] Handling DLQ job: ${JSON.stringify(job.data)}`,
    );

    // 🔥 Do something smart:
    // - Notify a dev team
    // - Store in a DB for audit
    // - Send an email alert
    // - Or even retry manually later
  }
}

