import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from 'src/features/health/indicators/bull-health.indicator';
import { RedisHealthIndicator } from 'src/features/health/indicators/redis-health.indicator';
import { TypeOrmHealthIndicator } from 'src/features/health/indicators/typeorm-health.indicator';
import { HealthCheckService } from './services/health.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SystemHealthIndicator } from 'src/features/health/indicators/system-health.indicator';

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
})
export class HealthModule {}
