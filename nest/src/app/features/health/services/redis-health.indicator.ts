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

    const start = Date.now();

    return redis
      .ping()
      .then(() =>
        indicator.up({
          ping: Date.now() - start,
          host: connection.host,
          port: connection.port,
        }),
      )
      .catch((error) =>
        indicator.down({ reason: error?.message ?? String(error) }),
      )
      .finally(() => redis.disconnect());
  }
}
