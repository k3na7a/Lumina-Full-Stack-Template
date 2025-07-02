import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { LOG_DLQ, LOG_QUEUE } from 'src/config/logger.config';

import { LogService } from './services/log.service';
import { LogProcessor } from './processors/log.processor';
import { QueueEventsProvider } from 'src/app/common/providers/queue-events.provider';
import { connection } from 'src/config/redis.config';

@Global()
@Module({
  imports: [BullModule.registerQueue({ name: LOG_QUEUE }, { name: LOG_DLQ })],
  providers: [
    LogService,
    LogProcessor,

    {
      provide: QueueEventsProvider,
      useFactory: () =>
        new QueueEventsProvider({
          queueName: LOG_QUEUE,
          connection,
          deadLetterQueueName: LOG_DLQ,
        }),
    },
  ],
  exports: [LogService],
})
export class LogQueueModule {}
