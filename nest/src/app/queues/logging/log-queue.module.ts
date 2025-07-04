import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { LogService } from './services/log.service';
import { LogQueueProcessor } from './processors/log.processor';
import { QueueEventsProvider } from 'src/app/common/providers/queue-events.provider';
import { connection } from 'src/app/config/redis.config';
import { DeadLetterQueueProcessor } from './processors/dlq.processor';
import { LoggerQueues } from 'src/library/enums/logger-actions.enum';

@Global()
@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: LoggerQueues.LOG_QUEUE,
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: false,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
        },
      },
      {
        name: LoggerQueues.LOG_DLQ,
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
    LogService,
    LogQueueProcessor,
    DeadLetterQueueProcessor,
    {
      provide: QueueEventsProvider,
      useFactory: () =>
        new QueueEventsProvider({
          queueName: LoggerQueues.LOG_QUEUE,
          connection,
          deadLetterQueueName: LoggerQueues.LOG_DLQ,
        }),
    },
  ],
  exports: [LogService],
})
export class LogQueueModule {}
