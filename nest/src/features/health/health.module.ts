import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { HealthCheckService } from './services/health.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullHealthIndicator } from './indicators/bull-health.indicator';
import { RedisHealthIndicator } from './indicators/redis-health.indicator';
import { SystemHealthIndicator } from './indicators/system-health.indicator';
import { TypeOrmHealthIndicator } from './indicators/typeorm-health.indicator';

@Module({
  imports: [TerminusModule, ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [
    BullHealthIndicator,
    RedisHealthIndicator,
    TypeOrmHealthIndicator,
    HealthCheckService,
    SystemHealthIndicator,
  ],
  exports: [
    RedisHealthIndicator,
    TypeOrmHealthIndicator,
    SystemHealthIndicator,
    BullHealthIndicator,
  ],
})
export class HealthModule {}
