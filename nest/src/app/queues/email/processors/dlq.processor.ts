import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { emailProps } from 'src/plugins/sendgrid.plugin';

@Processor('email-dlq')
export class DeadLetterQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(DeadLetterQueueProcessor.name);

  async process(job: Job<emailProps>) {
    this.logger.warn(`{${'email-dlq'}} Handling DLQ job: ID=${job.id}`);
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Graceful shutdown (${signal})...`);
    await Promise.allSettled([this.worker.close()]);
    this.logger.log('Shut down gracefully.');
  }
}
