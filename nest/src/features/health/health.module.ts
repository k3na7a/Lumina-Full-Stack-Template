import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from 'src/common/indicators/bull-health.indicator';
import { RedisHealthIndicator } from 'src/common/indicators/redis-health.indicator';
import { TypeOrmHealthIndicator } from 'src/common/indicators/typeorm-health.indicator';
import { HealthCheckService } from './services/health.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SystemHealthIndicator } from 'src/common/indicators/system-health.indicator';

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
