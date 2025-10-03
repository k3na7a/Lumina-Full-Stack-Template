import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { RedisHealthIndicator } from 'src/features/health/indicators/redis-health.indicator';
import { TypeOrmHealthIndicator } from 'src/features/health/indicators/typeorm-health.indicator';

import { HealthResponseDto } from '../dto/health.dto';
import { SystemHealthIndicator } from 'src/features/health/indicators/system-health.indicator';
import { BullHealthIndicator } from '../indicators/bull-health.indicator';

@SkipThrottle()
@ApiTags('Health Check')
@Controller('')
export class HealthController {
  constructor(
    private readonly redis: RedisHealthIndicator,
    private readonly database: TypeOrmHealthIndicator,
    private readonly system: SystemHealthIndicator,
    private readonly bull: BullHealthIndicator,
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

    const [log, log_dql, email, email_dlq] = await Promise.all([
      this.bull.isHealthy('logger-queue'),
      this.bull.isHealthy('logger-dlq'),
      this.bull.isHealthy('email-queue'),
      this.bull.isHealthy('email-dlq'),
    ]);

    return new HealthResponseDto({
      status: 'ok',
      details: {
        system: system.system,
        redis: redis.redis,
        typeorm: typeorm.typeorm,
      },
      queues: {
        logger: log['logger-queue'],
        logger_dlq: log_dql['logger-dlq'],
        email: email['email-queue'],
        email_dlq: email_dlq['email-dlq'],
      },
    });
  }
}
