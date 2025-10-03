import { HealthIndicatorResult } from '@nestjs/terminus';
import { WarningDto } from './health.dto';
import { ApiProperty } from '@nestjs/swagger';

import { IBullHealth } from '@lib/dto/health.dto';

export class BullHealthUpDto {
  @ApiProperty({
    example: 'up',
    description: 'Indicates the current status of the BullMQ queue',
  })
  public readonly status: 'up';

  @ApiProperty({
    example: 0,
    description: 'Number of jobs currently being processed (active workers)',
  })
  public readonly activeJobs: number;

  @ApiProperty({
    example: 2,
    description: 'Number of jobs waiting to be processed',
  })
  public readonly waitingJobs: number;

  @ApiProperty({
    example: 0,
    description: 'Number of jobs scheduled for a future time (delayed)',
  })
  public readonly delayedJobs: number;

  @ApiProperty({
    example: 0,
    description: 'Number of jobs in a paused state (queue is paused)',
  })
  public readonly pausedJobs: number;

  @ApiProperty({
    example: 0,
    description: 'Number of jobs that failed due to errors',
  })
  public readonly failedJobs: number;

  @ApiProperty({
    example: 100,
    description: 'Total number of jobs successfully completed',
  })
  public readonly completedJobs: number;

  @ApiProperty({
    type: [WarningDto],
    description:
      'List of warnings about queue health (e.g., too many failed jobs, backlog issues)',
  })
  public readonly warnings: WarningDto[];

  constructor(payload: IBullHealth) {
    this.status = 'up';
    this.activeJobs = payload.activeJobs;
    this.waitingJobs = payload.waitingJobs;
    this.delayedJobs = payload.delayedJobs;
    this.pausedJobs = payload.pausedJobs;
    this.failedJobs = payload.failedJobs;
    this.completedJobs = payload.completedJobs;
    this.warnings = payload.warnings;
  }
}

export type BullMQHealthResult =
  | HealthIndicatorResult<string, 'up', IBullHealth>
  | HealthIndicatorResult<string, 'down', { reason: string }>;

