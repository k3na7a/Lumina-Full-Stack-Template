import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { BullHealthIndicator } from 'src/app/common/indicators/bull-health.indicator';
import { RedisHealthIndicator } from 'src/app/common/indicators/redis-health.indicator';
import { DiskHealthIndicator } from 'src/app/common/indicators/disk-health.indicator';
import { TypeOrmHealthIndicator } from 'src/app/common/indicators/typeorm-health.indicator';

import { LoggerQueues } from 'src/library/enums/logger-actions.enum';

import { HealthResponseDto } from '../dto/health.dto';

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
      this.bull.isHealthy(LoggerQueues.LOG_QUEUE),
      this.bull.isHealthy(LoggerQueues.LOG_DLQ),
    ]);

    const services = results.reduce((acc, item) => ({ ...acc, ...item }), {});

    return new HealthResponseDto({ status: 'ok', details: services });
  }
}
