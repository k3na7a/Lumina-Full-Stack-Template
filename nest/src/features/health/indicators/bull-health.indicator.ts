import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import { Queue } from 'bullmq';
import { connection } from 'src/config/redis.config';
import { IBullQueueMetrics, Warning } from '@lib/dto/health.dto';
import { BullMQHealthResult } from '../dto/bull.dto';

@Injectable()
export class BullHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<BullMQHealthResult> {
    const indicator = this.healthIndicatorService.check(key);
    const queue = new Queue(key, { connection });

    const counts = await queue.getJobCounts();
    const { active, waiting, failed, delayed, paused, completed } = counts;

    const isPaused = await queue.isPaused().catch(() => false);

    const warnings: Warning[] = this.buildQueueWarnings({
      active,
      waiting,
      failed,
      delayed,
      paused,
      completed,
      isPaused,
    });

    return indicator.up({
      activeJobs: active,
      waitingJobs: waiting,
      delayedJobs: delayed,
      pausedJobs: paused,
      failedJobs: failed,
      completedJobs: completed ?? 0,
      warnings,
    });
  }

  private buildQueueWarnings(metrics: IBullQueueMetrics): Warning[] {
    const { waiting, failed, delayed, paused, isPaused } = metrics;
    const warnings: Warning[] = [];

    if (failed > 0) {
      warnings.push({
        message: `${failed} failed job(s) in queue`,
        severity: failed > 50 ? 'critical' : 'warning',
      });
    }

    if (waiting > 100) {
      warnings.push({
        message: `High backlog of waiting jobs (${waiting})`,
        severity: 'warning',
      });
    }

    if (delayed > 0) {
      warnings.push({
        message: `There are ${delayed} delayed jobs`,
        severity: 'info',
      });
    }

    if (paused > 0) {
      warnings.push({
        message: `Queue has ${paused} paused job(s)`,
        severity: 'info',
      });
    }

    if (isPaused && waiting > 0) {
      warnings.push({
        message: `Queue is paused while jobs are waiting`,
        severity: 'warning',
      });
    }

    return warnings;
  }
}
