import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

import { emailProps } from 'src/plugins/sendgrid.plugin';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('email-queue')
    public readonly emailQueue: Queue<emailProps>,
    @InjectQueue('email-dlq')
    public readonly deadLetterQueue: Queue,
  ) {}

  async sendEmail(payload: emailProps) {
    await this.emailQueue.add('email-queue', payload);
  }
}
