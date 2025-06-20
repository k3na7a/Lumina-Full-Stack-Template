import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import entities from 'src/config/entities.config';

const connectionOptions: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities,
  synchronize: true,
  timezone: 'Z',
};

export class TypeOrmPlugin {
  public static forRoot = TypeOrmModule.forRoot(connectionOptions);
  public static forFeature = (entities: EntityClassOrSchema[]) =>
    TypeOrmModule.forFeature(entities);
}
