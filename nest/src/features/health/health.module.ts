import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { BullHealthIndicator } from 'src/common/indicators/bull-health.indicator';
import { RedisHealthIndicator } from 'src/common/indicators/redis-health.indicator';
import { DiskHealthIndicator } from 'src/common/indicators/disk-health.indicator';
import { TypeOrmHealthIndicator } from 'src/common/indicators/typeorm-health.indicator';
import { HealthCheckService } from './services/health.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TerminusModule, ScheduleModule.forRoot()],
  controllers: [HealthController],
  providers: [
    BullHealthIndicator,
    RedisHealthIndicator,
    DiskHealthIndicator,
    TypeOrmHealthIndicator,
    HealthCheckService,
  ],
})
export class HealthModule {}
