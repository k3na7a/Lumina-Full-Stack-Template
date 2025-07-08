import { Logger } from 'typeorm';

import { useStringUtil } from 'src/app/common/utilities/string.util';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { LoggerActions } from 'src/library/enums/logger-actions.enum';

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
      message: { Query: query, Params: JSON.stringify(parameters) },
    });
  }

  async logQueryError(
    error: string,
    query: string,
    parameters?: any[],
  ): Promise<void> {
    if (!this.isEnabled('error')) return;

    await this.logService.log({
      type: LoggerActions.ERR,
      context: this.context,
      message: {
        error,
        query,
        params: JSON.stringify(parameters),
      },
    });
  }

  async logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
  ): Promise<void> {
    if (!this.isEnabled('warn')) return;

    await this.logService.log({
      type: LoggerActions.WARN,
      context: this.context,
      message: {
        ['slow query']: `${time}ms`,
        query: query,
        params: JSON.stringify(parameters),
      },
    });
  }

  async logSchemaBuild(message: string): Promise<void> {
    if (!this.isEnabled('schema')) return;

    await this.logService.log({
      type: LoggerActions.INFO,
      context: this.context,
      message: { ['schema build']: message },
    });
  }

  async logMigration(message: string): Promise<void> {
    if (!this.isEnabled('migration')) return;

    await this.logService.log({
      type: LoggerActions.WARN,
      context: this.context,
      message: { migration: message },
    });
  }

  async log(level: 'warn' | 'info' | 'log', message: any): Promise<void> {
    if (!this.isEnabled(level)) return;

    const { capitalize } = this.stringUtil;

    switch (level) {
      case 'log':
      case 'info':
        await this.logService.log({
          type: LoggerActions.INFO,
          context: this.context,
          message: {
            message: `${capitalize(level)} -- ${message}`,
          },
        });
        break;
      case 'warn':
        await this.logService.log({
          type: LoggerActions.WARN,
          context: this.context,
          message: {
            message: `${capitalize(level)} -- ${message}`,
          },
        });
        break;
      default:
    }
  }
}
