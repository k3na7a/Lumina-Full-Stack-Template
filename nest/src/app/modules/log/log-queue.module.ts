import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { LOG_QUEUE } from 'src/config/logger.config';

import { LogService } from './services/log.service';
import { LogProcessor } from './processors/log.processor';
import { BullQueueEventsProvider } from './providers/queue-events.provider';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: LOG_QUEUE,
    }),
  ],
  providers: [LogService, LogProcessor, BullQueueEventsProvider],
  exports: [LogService],
})
export class LogQueueModule {}
