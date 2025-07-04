import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from '../../common/indicators/bull-health.indicator';
import { RedisHealthIndicator } from '../../common/indicators/redis-health.indicator';
import { DiskHealthIndicator } from '../../common/indicators/disk-health.indicator';
import { TypeOrmHealthIndicator } from '../../common/indicators/typeorm-health.indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [
    BullHealthIndicator,
    RedisHealthIndicator,
    DiskHealthIndicator,
    TypeOrmHealthIndicator,
  ],
})
export class HealthModule {}
