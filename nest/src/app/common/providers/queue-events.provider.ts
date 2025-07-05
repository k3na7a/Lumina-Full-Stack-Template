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
    const { deadLetterQueueName } = this.options;

    queueEvents.on('failed', async ({ jobId }) => {
      const job = await this.queue.getJob(jobId);
      if (!job) return;

      if (this.dlq && deadLetterQueueName) {
        await this.dlq.add(deadLetterQueueName, job.data);
        return;
      }
    });

    queueEvents.on('stalled', async () => {});
    queueEvents.on('added', async () => {});
    queueEvents.on('completed', () => {});

    await queueEvents.waitUntilReady();
  }
}
