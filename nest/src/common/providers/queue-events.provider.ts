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

    const LOGGER = new Logger(QueueEventsProvider.name);

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      LOGGER.error(`Job ${jobId} Failed: ${failedReason}`);

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

        LOGGER.verbose(`Job ${jobId} added to DLQ ${deadLetterQueueName}`);
        await this.dlq.add(deadLetterQueueName, failurePayload);

        return;
      }
    });

    queueEvents.on('stalled', async ({ jobId }) => {
      LOGGER.warn(`Job ${jobId} Stalled!`);
    });

    queueEvents.on('added', async ({ jobId, name }) => {
      LOGGER.verbose(`Job ${jobId}:${name} Added!`);
    });

    queueEvents.on('completed', ({ jobId }) => {
      LOGGER.verbose(`Job ${jobId} Completed!`);
    });

    await queueEvents.waitUntilReady();
  }
}
