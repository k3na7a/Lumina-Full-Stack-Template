import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import entities from 'src/config/entities.config';
import { LogQueueModule } from 'src/app/queues/logging/log-queue.module';
import { LogService } from 'src/app/queues/logging/services/log.service';
import { TypeOrmQueueLogger } from 'src/app/common/loggers/typeorm.logger';

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