import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from 'src/app/common/indicators/bull-health.indicator';
import { RedisHealthIndicator } from 'src/app/common/indicators/redis-health.indicator';
import { DiskHealthIndicator } from 'src/app/common/indicators/disk-health.indicator';
import { TypeOrmHealthIndicator } from 'src/app/common/indicators/typeorm-health.indicator';

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
