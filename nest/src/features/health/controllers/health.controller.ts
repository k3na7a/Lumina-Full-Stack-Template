import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { RedisHealthIndicator } from 'src/features/health/indicators/redis-health.indicator';
import { TypeOrmHealthIndicator } from 'src/features/health/indicators/typeorm-health.indicator';

import { HealthResponseDto, ServicesHealth } from '../dto/health.dto';
import { SystemHealthIndicator } from 'src/features/health/indicators/system-health.indicator';

@SkipThrottle()
@ApiTags('Health Check')
@Controller('')
export class HealthController {
  constructor(
    private readonly redis: RedisHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
    private readonly system: SystemHealthIndicator,
  ) {}

  @Get('')
  @ApiOkResponse({
    description: 'Service is healthy',
    type: HealthResponseDto,
  })
  async check() {
    const [system, redis, typeorm] = await Promise.all([
      this.system.previewSystem('system'),
      this.redis.overviewCheck('redis'),
      this.database.isHealthy('typeorm'),
    ]);

    // const bullMQ = await Promise.all([
    //   this.bull.isHealthy(LoggerQueues.LOG_QUEUE),
    //   this.bull.isHealthy(LoggerQueues.LOG_DLQ),
    //   this.bull.isHealthy('email-queue'),
    //   this.bull.isHealthy('email-dlq'),
    // ]);

    const services: ServicesHealth = {
      system: system.system,
      redis: redis.redis,
      typeorm: typeorm.typeorm,
    };

    return new HealthResponseDto({ status: 'ok', details: services });
  }
}
