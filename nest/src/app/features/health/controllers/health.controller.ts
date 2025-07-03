import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LOG_DLQ, LOG_QUEUE } from 'src/app/config/logger.config';

import { BullHealthIndicator } from '../services/bull-health.indicator';
import { RedisHealthIndicator } from '../services/redis-health.indicator';
import { DiskHealthIndicator } from '../services/disk-health.indicator';
import { TypeOrmHealthIndicator } from '../services/typeorm-health.indicator';

import { HealthResponseDto } from '../dto/health.dto';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@ApiTags('Health Check')
@Controller('')
export class HealthController {
  constructor(
    private readonly bull: BullHealthIndicator,
    private readonly redis: RedisHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  @Get('')
  @ApiOkResponse({
    description: 'Service is healthy',
    type: HealthResponseDto,
  })
  async check() {
    const results = await Promise.all([
      this.disk.checkStorage('disk'),
      this.database.isHealthy('database'),
      this.redis.pingCheck('redis'),
      this.bull.isHealthy(LOG_QUEUE),
      this.bull.isHealthy(LOG_DLQ),
    ]);

    const services = results.reduce((acc, item) => ({ ...acc, ...item }), {});

    return new HealthResponseDto({ status: 'ok', details: services });
  }
}
