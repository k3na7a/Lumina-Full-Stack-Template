import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

interface QueueEventsProviderOptions {
  queueName: string;
  connection: any;
  deadLetterQueueName?: string;
}

@Injectable()
export class QueueEventsProvider implements OnModuleInit {
  private readonly logger = new Logger(QueueEventsProvider.name);

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
    const logger = this.logger;

    const { queueName, deadLetterQueueName } = this.options;

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      const job = await this.queue.getJob(jobId);
      if (!job) return;

      const attemptsMade = job.attemptsMade;
      const maxAttempts = job.opts.attempts || 1;

      logger.error(
        `{${queueName}} Job failed: ID=${jobId} Attempts=${attemptsMade}/${maxAttempts} Reason=${failedReason}`,
      );

      if (this.dlq && deadLetterQueueName) {
        logger.warn(
          `{${queueName}} Moving job ID=${jobId} to DLQ {${deadLetterQueueName}}`,
        );

        await this.dlq.add(deadLetterQueueName, job.data);

        logger.log(
          `{${queueName}} Job ID=${jobId} successfully added to DLQ {${deadLetterQueueName}}`,
        );
        return;
      }
      logger.warn(
        `{${queueName}} Job ID=${jobId} permanently failed — no DLQ attached.`,
      );
    });

    queueEvents.on('stalled', async ({ jobId }) => {
      logger.warn(`{${queueName}} Job stalled: ID=${jobId}`);
    });

    queueEvents.on('added', async ({ jobId }) => {
      logger.log(`{${queueName}} Job started: ID=${jobId}`);
    });

    queueEvents.on('completed', ({ jobId }) => {
      logger.log(`{${this.options.queueName}} Job completed: ID=${jobId}`);
    });

    await queueEvents.waitUntilReady();
    logger.log(`{${this.options.queueName}} Events listeners ready.`);
  }
}
