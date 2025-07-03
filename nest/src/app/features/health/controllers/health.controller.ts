import { Controller, Get } from '@nestjs/common';
import { DiskHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LOG_DLQ, LOG_QUEUE } from 'src/app/config/logger.config';
import { getRootPath } from 'src/app/common/utilities/path.util';

import { BullHealthIndicator } from '../services/bull-health.indicator';
import { RedisHealthIndicator } from '../services/redis-health.indicator';
import { HealthResponseDto } from '../dto/health.dto';
import checkDiskSpace from 'check-disk-space';

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
    const disk = { path: getRootPath(), thresholdPercent: 0.9 };

    const results = await Promise.all([
      this.disk.checkStorage('disk', disk),
      this.database.pingCheck('database', { timeout: 300 }),
      this.redis.pingCheck('redis'),
      this.bull.isHealthy(LOG_QUEUE),
      this.bull.isHealthy(LOG_DLQ),
    ]);

    console.log(await checkDiskSpace(getRootPath()));

    const services = results.reduce((acc, item) => ({ ...acc, ...item }), {});

    return new HealthResponseDto({ status: 'ok', details: services });
  }
}
