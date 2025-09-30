import { Injectable, OnModuleInit } from '@nestjs/common';
import { LogService } from 'src/queues/logging/services/log.service';
import {
  LoggerActions,
  LoggerPath,
} from 'src/queues/logging/enums/logger-actions.enum';
import { DataSource } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class ConnectionLogger implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logService: LogService,
  ) {}

  async onModuleInit() {
    const debug = false;
    const { host, port, database } = this.dataSource
      .options as MysqlConnectionOptions;
    if (debug)
      await this.logService.log({
        path: LoggerPath.SYSTEM,
        type: LoggerActions.INFO,
        context: ConnectionLogger.name,
        message: {
          message: `Database connected!`,
          database,
          port,
          host,
        },
      });
  }

  async onApplicationShutdown(signal?: string) {
    const { host, port, database } = this.dataSource
      .options as MysqlConnectionOptions;

    await this.logService.log({
      path: LoggerPath.SYSTEM,
      type: LoggerActions.WARN,
      context: ConnectionLogger.name,
      message: {
        message: `Database disconnected! (${signal || 'SIGTERM'})`,
        database,
        port,
        host,
      },
    });
  }
}
