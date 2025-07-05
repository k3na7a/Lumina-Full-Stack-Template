import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QueueEventsProvider } from 'src/app/common/providers/queue-events.provider';
import { connection } from 'src/config/redis.config';
import { EmailQueueProcessor } from './processors/email.processor';
import { DeadLetterQueueProcessor } from './processors/dlq.processor';
import { EmailService } from './services/email.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email-queue',
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      },
      {
        name: 'email-dlq',
        defaultJobOptions: {
          removeOnComplete: false,
          removeOnFail: false,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      },
    ),
  ],
  providers: [
    EmailService,
    EmailQueueProcessor,
    DeadLetterQueueProcessor,
    {
      provide: QueueEventsProvider,
      useFactory: () =>
        new QueueEventsProvider({
          queueName: 'email-queue',
          connection,
          deadLetterQueueName: 'email-dlq',
        }),
    },
  ],
  exports: [EmailService],
})
export class EmailQueueModule {}
