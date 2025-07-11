import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import { Queue } from 'bullmq';
import { connection } from 'src/config/redis.config';

@Injectable()
export class BullHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);
    const queue = new Queue(key, { connection });

    const counts = await queue.getJobCounts();
    const { active, waiting, failed, delayed, paused } = counts;
    const isHealthy = failed === 0;

    const details: Record<string, number> = {};
    if (active > 0) details.activeJobs = active;
    if (waiting > 0) details.waitingJobs = waiting;
    if (delayed > 0) details.delayedJobs = delayed;
    if (paused > 0) details.pausedJobs = paused;
    if (failed > 0) details.failedJobs = failed;

    return isHealthy
      ? indicator.up(details)
      : indicator.down({
          ...details,
          reason: `${failed} failed job(s) in queue`,
        });
  }
}
