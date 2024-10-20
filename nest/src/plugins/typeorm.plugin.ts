import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

import { AvatarEntity } from 'src/app/modules/users/entities/avatar.entity';
import { ProfileEntity } from 'src/app/modules/users/entities/profile.entity';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { PlatformEntity } from 'src/app/modules/games/entities/platform.entity';
import { GameEntity } from 'src/app/modules/games/entities/game.entity';
import { GenreEntity } from 'src/app/modules/games/entities/genre.entity';
import { CoverEntity } from 'src/app/modules/games/entities/cover.entity';
import { SeriesEntity } from 'src/app/modules/games/entities/series.entity';
import { DeveloperEntity } from 'src/app/modules/games/entities/developer.entity';
import { PublisherEntity } from 'src/app/modules/games/entities/publisher.entity';
import { GametypeEntity } from 'src/app/modules/games/entities/gametype.entity';

const entities = [
  // # users
  UserEntity,
  ProfileEntity,
  AvatarEntity,

  // # video game library
  GameEntity,
  PlatformEntity,
  GenreEntity,
  CoverEntity,
  SeriesEntity,
  DeveloperEntity,
  PublisherEntity,
  GametypeEntity,
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
