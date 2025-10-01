import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { LogService } from 'src/queues/logging/services/log.service';

interface QueueEventsProviderOptions {
  queueName: string;
  connection: any;
  deadLetterQueueName?: string;
  logService?: LogService;
}

@Injectable()
export class QueueEventsProvider implements OnModuleInit {
  private readonly queue: Queue;
  private readonly queueEvents: QueueEvents;
  private readonly dlq?: Queue;

  private readonly LOGGER: Logger;

  constructor(private readonly options: QueueEventsProviderOptions) {
    const { connection, queueName, deadLetterQueueName } = this.options;

    this.queue = new Queue(queueName, { connection });
    this.queueEvents = new QueueEvents(queueName, { connection });

    if (deadLetterQueueName)
      this.dlq = new Queue(deadLetterQueueName, { connection });
  }

  async onModuleInit() {
    const queueEvents = this.queueEvents;
    const { deadLetterQueueName } = this.options;

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      Logger.error(
        `Job ${jobId} Failed: ${failedReason}`,
        QueueEventsProvider.name,
      );

      const job = await this.queue.getJob(jobId);
      if (!job) return;

      if (this.dlq && deadLetterQueueName) {
        const failurePayload = {
          originalData: job.data,
          meta: {
            jobId: job.id,
            attemptsMade: job.attemptsMade,
            failedReason,
            stacktrace: job.stacktrace,
            timestamp: Date.now(),
            queueName: this.queue.name,
          },
        };

        Logger.verbose(
          `Job ${jobId} added to DLQ ${deadLetterQueueName}`,
          QueueEventsProvider.name,
        );
        await this.dlq.add(deadLetterQueueName, failurePayload);

        return;
      }
    });

    queueEvents.on('stalled', async ({ jobId }) => {
      Logger.warn(`Job ${jobId} Stalled!`, QueueEventsProvider.name);
    });

    queueEvents.on('added', async ({ jobId, name }) => {
      Logger.verbose(`Job ${jobId}:${name} Added!`, QueueEventsProvider.name);
    });

    queueEvents.on('completed', ({ jobId }) => {
      Logger.verbose(`Job ${jobId} Completed!`, QueueEventsProvider.name);
    });

    await queueEvents.waitUntilReady();
  }
}
