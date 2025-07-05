import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

import { emailProps, SendGridPlugin } from 'src/plugins/sendgrid.plugin';

@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  async process(job: Job<emailProps>) {
    const { to, subject, html } = job.data;
    await SendGridPlugin.sendMail({
      to,
      subject,
      html,
    });
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.warn(`Graceful shutdown (${signal})...`);
    await Promise.allSettled([this.worker.close()]);
    this.logger.log('Shut down gracefully.');
  }
}
