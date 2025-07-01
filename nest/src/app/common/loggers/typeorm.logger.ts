import { Logger } from 'typeorm';
import { LoggerActions } from 'src/config/logger.config';
import { LogService } from '../../queues/logging/services/log.service';

type Logging = Array<
  'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
>;

export class TypeOrmQueueLogger implements Logger {
  constructor(
    private readonly logService: LogService,
    private readonly options: {
      logLevels: Logging;
    },
  ) {}

  private isEnabled(level: string): boolean {
    return this.options.logLevels.includes(level as any);
  }

  logQuery(query: string, parameters?: any[]): void {
    if (!this.isEnabled('query')) return;

    this.logService.log({
      type: LoggerActions.LOG,
      context: 'TYPEORM',
      message: `QUERY: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logQueryError(error: string, query: string, parameters?: any[]): void {
    if (!this.isEnabled('error')) return;

    this.logService.log({
      type: LoggerActions.ERROR,
      context: 'TYPEORM',
      message: `${error} -- QUERY: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    if (!this.isEnabled('warn')) return;

    this.logService.log({
      type: LoggerActions.WARNING,
      context: 'TYPEORM',
      message: `[TYPEORM - SLOW QUERY]: ${time}ms -- ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logSchemaBuild(message: string): void {
    if (!this.isEnabled('schema')) return;

    this.logService.log({
      type: LoggerActions.VERBOSE,
      context: 'TYPEORM',
      message: `SCHEMA BUILD: ${message}`,
    });
  }

  logMigration(message: string): void {
    if (!this.isEnabled('migration')) return;

    this.logService.log({
      type: LoggerActions.DEBUG,
      context: 'TYPEORM',
      message: `MIGRATION: ${message}`,
    });
  }

  log(
    level: 'log' | 'info' | 'warn' | 'migration' | 'schema',
    message: any,
  ): void {
    if (!this.isEnabled(level)) return;

    switch (level) {
      case 'log':
      case 'info':
      case 'migration':
      case 'schema':
        this.logService.log({
          type: LoggerActions.INFO,
          context: 'TYPEORM',
          message: message,
        });
        break;
      case 'warn':
        this.logService.log({
          type: LoggerActions.WARNING,
          context: 'TYPEORM',
          message,
        });
        break;
      default:
    }
  }
}
