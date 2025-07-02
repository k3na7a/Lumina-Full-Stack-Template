import { Logger } from 'typeorm';
import { LoggerActions } from 'src/config/logger.config';
import { LogService } from '../../queues/logging/services/log.service';
import { useStringUtil } from '../utilities/string.util';

type Logging = Array<
  'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
>;

export class TypeOrmLogger implements Logger {
  private readonly stringUtil = useStringUtil();
  private readonly context = TypeOrmLogger.name;

  constructor(
    private readonly logService: LogService,
    private readonly options: {
      logLevels: Logging;
    },
  ) {}

  private isEnabled(level: string): boolean {
    return this.options.logLevels.includes(level as any);
  }

  async logQuery(query: string, parameters?: any[]): Promise<void> {
    if (!this.isEnabled('query')) return;

    await this.logService.log({
      type: LoggerActions.INFO,
      context: this.context,
      message: `Query: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  async logQueryError(error: string, query: string, parameters?: any[]): Promise<void> {
    if (!this.isEnabled('error')) return;

    await this.logService.log({
      type: LoggerActions.ERR,
      context: this.context,
      message: `Error: ${error} -- Query: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  async logQuerySlow(time: number, query: string, parameters?: any[]): Promise<void> {
    if (!this.isEnabled('warn')) return;

    await this.logService.log({
      type: LoggerActions.WARN,
      context: this.context,
      message: `Slow Query: ${time}ms -- Query: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  async logSchemaBuild(message: string): Promise<void> {
    if (!this.isEnabled('schema')) return;

    await this.logService.log({
      type: LoggerActions.INFO,
      context: this.context,
      message: `Schema Build: ${message}`,
    });
  }

  async logMigration(message: string): Promise<void> {
    if (!this.isEnabled('migration')) return;

    await this.logService.log({
      type: LoggerActions.INFO,
      context: this.context,
      message: `Migration: ${message}`,
    });
  }

  async log(
    level: 'log' | 'info' | 'warn' | 'migration' | 'schema',
    message: any,
  ): Promise<void> {
    if (!this.isEnabled(level)) return;

    const { capitalize } = this.stringUtil;

    switch (level) {
      case 'log':
      case 'info':
      case 'migration':
      case 'schema':
        await this.logService.log({
          type: LoggerActions.INFO,
          context: this.context,
          message: `${capitalize(level)} -- ${message}`,
        });
        break;
      case 'warn':
        await this.logService.log({
          type: LoggerActions.WARN,
          context: this.context,
          message: `${capitalize(level)} -- ${message}`,
        });
        break;
      default:
    }
  }
}
