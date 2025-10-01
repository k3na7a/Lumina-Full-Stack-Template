import { Injectable, OnModuleInit } from '@nestjs/common';
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

    queueEvents.on('failed', async ({ jobId, failedReason }) => {
      console.log('Job Failed:', jobId, failedReason);
      
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

        await this.dlq.add(deadLetterQueueName, failurePayload);

        return;
      }
    });

    queueEvents.on('stalled', async ({ jobId }) => {
      console.log('Job Stalled:', jobId);
    });

    queueEvents.on('error', async (error) => {
      console.log('Job Error:', error);
    });

    queueEvents.on('added', async ({ jobId, name }) => {
      console.log('Job Added:', name, jobId);
    });

    queueEvents.on('completed', ({ jobId, returnvalue }) => {
      console.log('Job Completed:', jobId, returnvalue);
    });

    await queueEvents.waitUntilReady();
  }
}
