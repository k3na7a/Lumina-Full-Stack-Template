import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from './services/bull-health.indicator';
import { RedisHealthIndicator } from './services/redis-health.indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [BullHealthIndicator, RedisHealthIndicator],
})
export class HealthModule {}
