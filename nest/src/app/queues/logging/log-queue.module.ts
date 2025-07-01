import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { LOG_QUEUE } from 'src/config/logger.config';

import { LogService } from './services/log.service';
import { LogProcessor } from './processors/log.processor';
import { QueueEventsProvider } from 'src/app/common/providers/queue-events.provider';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: LOG_QUEUE,
    }),
  ],
  providers: [
    LogService,
    LogProcessor,
    {
      provide: QueueEventsProvider,
      useFactory: () => {
        return new QueueEventsProvider(LOG_QUEUE);
      },
    },
  ],
  exports: [LogService],
})
export class LogQueueModule {}
