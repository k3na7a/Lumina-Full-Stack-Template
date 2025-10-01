import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import { emailProps, SendGridPlugin } from 'src/plugins/sendgrid.plugin';

@Processor('email-queue')
export class EmailQueueProcessor extends WorkerHost {
  async process(job: Job<emailProps>) {
    const { to, subject, html } = job.data;
    await SendGridPlugin.sendMail({
      to,
      subject,
      html,
    });
  }

  async onApplicationShutdown() {
    await Promise.allSettled([this.worker.close()]);
  }
}
