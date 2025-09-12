import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/app/queues/logging/enums/logger-actions.enum';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly logService: LogService,
    private readonly dataSource: DataSource,
  ) {}

  async reconnectDatasource(): Promise<void> {
    const { options } = this.dataSource;

    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();

      await this.logService.log({
        type: LoggerActions.WARN,
        context: HealthCheckService.name,
        message: {
          Message: 'Existing connection closed. Attempting to re-initialize...',
          Database: options.database,
          Port: 'port' in options ? options.port : undefined,
          Host: 'host' in options ? options.host : undefined,
        },
      });
    }

    try {
      await this.dataSource.initialize();

      await this.logService.log({
        type: LoggerActions.INFO,
        context: HealthCheckService.name,
        message: {
          Message: 'Database reconnected successfully!',
          Database: options.database,
          Port: 'port' in options ? options.port : undefined,
          Host: 'host' in options ? options.host : undefined,
        },
      });
    } catch (err) {
      await this.logService.log({
        type: LoggerActions.ERR,
        context: HealthCheckService.name,
        message: {
          Message: 'Reconnection attempt failed!',
          Database: options.database,
          Port: 'port' in options ? options.port : undefined,
          Host: 'host' in options ? options.host : undefined,
          Error: err.message,
        },
      });
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS, { name: 'db-health' })
  async checkDatabaseConnection(): Promise<void> {
    const { options } = this.dataSource;
    try {
      await this.dataSource.query('SELECT 1');
    } catch (err: any) {
      await this.logService.log({
        type: LoggerActions.ERR,
        context: HealthCheckService.name,
        message: {
          Message: 'Database connection lost!',
          Database: options.database,
          Port: 'port' in options ? options.port : undefined,
          Host: 'host' in options ? options.host : undefined,
          Error: err.message,
        },
      });
      await this.reconnectDatasource();
    }
  }
}
