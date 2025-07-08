import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource } from 'typeorm';

import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/library/enums/logger-actions.enum';

@Injectable()
export class HealthCheckService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logService: LogService,
  ) {}

  async reconnectDatasource() {
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

    await this.dataSource
      .initialize()
      .then(
        async () =>
          await this.logService.log({
            type: LoggerActions.INFO,
            context: HealthCheckService.name,
            message: {
              Message: 'Database reconnected successfully!',
              Database: options.database,
              Port: 'port' in options ? options.port : undefined,
              Host: 'host' in options ? options.host : undefined,
            },
          }),
      )
      .catch(
        async (err) =>
          await this.logService.log({
            type: LoggerActions.ERR,
            context: HealthCheckService.name,
            message: {
              Message: `Reconnection attempt failed!`,
              Error: err.message,
              Stack: JSON.stringify(err),
            },
          }),
      );
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkDatabaseConnection(): Promise<void> {
    const { options } = this.dataSource;

    await this.dataSource.query('SELECT 1').catch(async (err) => {
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
    });
  }
}
