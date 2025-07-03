import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { Queue } from 'bullmq';
import { connection } from 'src/app/config/redis.config';

@Injectable()
export class BullHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    const queue = new Queue(key, { connection });

    const { failed } = await queue.getJobCounts();
    const isHealthy = failed === 0;

    if (isHealthy) return indicator.up();
    return indicator.down({ failedJobs: failed });
  }
}
