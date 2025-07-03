import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';
import Redis from 'ioredis';
import { connection } from 'src/app/config/redis.config';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async pingCheck(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    const redis = new Redis(connection);

    const result = await redis.ping();
    redis.disconnect();

    if (result === 'PONG') return indicator.up();
    return indicator.down();
  }
}
