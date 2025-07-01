import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueEvents } from 'bullmq';
import { LOG_QUEUE } from 'src/config/logger.config';

@Injectable()
export class BullQueueEventsProvider implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    const connection = {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    };

    const queueEvents = new QueueEvents(LOG_QUEUE, { connection });

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      Logger.log(
        `[QueueEvents] Job failed: ID=${jobId} Reason=${failedReason}`,
      );
    });

    queueEvents.on('completed', async ({ jobId }) => {
      Logger.log(`[QueueEvents] Job completed: ID=${jobId}`);
    });

    await queueEvents.waitUntilReady();
    Logger.log('[QueueEvents] Log-queue events listener ready.');
  }
}
