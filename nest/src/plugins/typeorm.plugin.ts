import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { ImageEntity } from 'src/app/media/entities/image.entity';
import { ProfileEntity } from 'src/app/users/entities/profile.entity';
import { UserEntity } from 'src/app/users/entities/user.entity';
import { GameEntity } from 'src/app/games/entities/game.entity';
import { PlatformEntity } from 'src/app/games/entities/platform.entity';

const entities = [
  // GENERIC
  ImageEntity,
  // USERS
  UserEntity,
  ProfileEntity,
  // GAMES & SOFTWARE
  GameEntity,
  PlatformEntity,
];

const config: TypeOrmModuleOptions = {
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
  public static forRoot = TypeOrmModule.forRoot(config);
  public static forFeature = (entities: EntityClassOrSchema[]) =>
    TypeOrmModule.forFeature(entities);
}
