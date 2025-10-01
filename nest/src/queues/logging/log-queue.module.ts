import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { LogService } from './services/log.service';
import { LogQueueProcessor } from './processors/log.processor';
import { QueueEventsProvider } from 'src/common/providers/queue-events.provider';
import { connection } from 'src/config/redis.config';
import { DeadLetterQueueProcessor } from './processors/dlq.processor';
import { LoggerQueues } from 'src/queues/logging/enums/logger-actions.enum';
import { S3Service } from 'src/modules/shared/services/s3.service';

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
    S3Service,
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
