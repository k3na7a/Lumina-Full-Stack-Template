import { HealthIndicatorResult } from '@nestjs/terminus';
import { Warning, WarningDto } from './health.dto';
import { ApiProperty } from '@nestjs/swagger';

export class BullHealthUpDto {
  @ApiProperty({ example: 'up' }) status: 'up';
  @ApiProperty({ example: 0 }) activeJobs: number;
  @ApiProperty({ example: 2 }) waitingJobs: number;
  @ApiProperty({ example: 0 }) delayedJobs: number;
  @ApiProperty({ example: 0 }) pausedJobs: number;
  @ApiProperty({ example: 0 }) failedJobs: number;
  @ApiProperty({ example: 100 }) completedJobs: number;
  @ApiProperty({ type: [WarningDto] }) warnings: WarningDto[];
}

export interface IBullQueueMetrics {
  active: number;
  waiting: number;
  failed: number;
  delayed: number;
  paused: number;
  completed: number;
  isPaused: boolean;
}

export interface IBullHealth {
  activeJobs: number;
  waitingJobs: number;
  delayedJobs: number;
  pausedJobs: number;
  failedJobs: number;
  completedJobs: number;
  warnings: Warning[];
}

export type BullMQHealthResult =
  | HealthIndicatorResult<string, 'up', IBullHealth>
  | HealthIndicatorResult<string, 'down', { reason: string }>;

export type BullMQQueueHealth =
  | ({ status: 'up' } & IBullHealth)
  | { status: 'down'; reason: string };
