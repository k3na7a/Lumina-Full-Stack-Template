import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import entities from 'src/config/entities.config';
import { LogQueueModule } from 'src/app/queues/logging/log-queue.module';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { TypeOrmLogger } from 'src/app/common/loggers/typeorm.logger';

type Logging = Array<
  'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
>;

const logging: Logging = ['error', 'warn', 'migration'];
const connectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  entities,
  synchronize: true,
  maxQueryExecutionTime: 500,
  extra: {
    connectionLimit: 10,
    maxIdle: 5,
    idleTimeout: 60000,
    enableKeepAlive: true,
  },
  timezone: 'Z',
};

export class TypeOrmPlugin {
  public static forRoot = TypeOrmModule.forRootAsync({
    imports: [LogQueueModule],
    inject: [LogService],
    useFactory: (logService: LogService) => ({
      ...connectionOptions,
      logger: new TypeOrmLogger(logService, {
        logLevels: logging,
      }),
      logging,
    }),
  });
  public static forFeature = (entities: EntityClassOrSchema[]) =>
    TypeOrmModule.forFeature(entities);
}
