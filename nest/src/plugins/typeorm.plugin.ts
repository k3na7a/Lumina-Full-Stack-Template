import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from 'typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { LogQueueModule } from 'src/app/modules/log/log-queue.module';
import { LogService } from 'src/app/modules/log/services/log.service';

import entities from 'src/config/entities.config';
import { LoggerActions } from 'src/config/logger.config';

type Logging = Array<
  'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
>;

const logging: Logging = ['warn', 'error'];
const connectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities,
  synchronize: true,
};

export class TypeOrmPlugin {
  public static forRoot = TypeOrmModule.forRootAsync({
    imports: [LogQueueModule],
    inject: [LogService],
    useFactory: (logService: LogService) => ({
      ...connectionOptions,
      logger: new TypeOrmQueueLogger(logService, {
        logLevels: logging,
      }),
      logging,
    }),
  });
  public static forFeature = (entities: EntityClassOrSchema[]) =>
    TypeOrmModule.forFeature(entities);
}

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
      type: LoggerActions.INFO,
      message: `[TYPEORM - QUERY]: ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logQueryError(error: string, query: string, parameters?: any[]): void {
    if (!this.isEnabled('error')) return;

    this.logService.log({
      type: LoggerActions.ERROR,
      message: `[TYPEORM - QUERY ERROR]: ${error} -- ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[]): void {
    if (!this.isEnabled('warn')) return;

    this.logService.log({
      type: LoggerActions.WARNING,
      message: `[TYPEORM - SLOW QUERY]: ${time}ms -- ${query} -- Params: ${JSON.stringify(parameters)}`,
    });
  }

  logSchemaBuild(message: string): void {
    if (!this.isEnabled('schema')) return;

    this.logService.log({
      type: LoggerActions.INFO,
      message: `[TYPEORM - SCHEMA BUILD]: ${message}`,
    });
  }

  logMigration(message: string): void {
    if (!this.isEnabled('migration')) return;

    this.logService.log({
      type: LoggerActions.INFO,
      message: `[TYPEORM - MIGRATION]: ${message}`,
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
          message: `[TYPEORM - ${level.toUpperCase()}]: ${message}`,
        });
        break;
      case 'warn':
        this.logService.log({
          type: LoggerActions.WARNING,
          message: `[TYPEORM - ${level.toUpperCase()}]: ${message}`,
        });
        break;
      default:
    }
  }
}
