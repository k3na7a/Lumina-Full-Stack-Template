import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueEvents } from 'bullmq';
import { connection } from 'src/config/redis.config';

@Injectable()
export class QueueEventsProvider implements OnModuleInit {
  constructor(private readonly queue: string) {}

  async onModuleInit() {
    const queueEvents = new QueueEvents(this.queue, { connection });

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      Logger.error(
        `Job failed: ID=${jobId} Reason=${failedReason}`,
        this.queue,
      );
    });

    queueEvents.on('completed', async ({ jobId }) => {
      Logger.log(`Job completed: ID=${jobId}`, this.queue);
    });

    await queueEvents.waitUntilReady();
    Logger.log(`Event listeners ready.`, this.queue);
  }
}
