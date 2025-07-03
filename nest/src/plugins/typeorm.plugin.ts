import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import entities from 'src/app/config/entities.config';
import { LogQueueModule } from 'src/app/queues/logging/log-queue.module';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { TypeOrmLogger } from 'src/app/common/loggers/typeorm.logger';

type Logging = Array<
  'query' | 'error' | 'warn' | 'info' | 'log' | 'migration' | 'schema'
>;

const logging: Logging = ['warn', 'error'];
const connectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  entities,
  synchronize: process.env.NODE_ENV !== 'production',
  maxQueryExecutionTime: 500,
  extra: {
    connectionLimit: 10,
  },
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
