import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { PlatformService } from './services/platform.service';
import { GameService } from './services/game.service';

import { PlatformEntity } from './entities/platform.entity';
import { GameEntity } from './entities/game.entity';
import { GenreEntity } from './entities/genre.entity';
import { GenreService } from './services/genre.service';
import { CoverEntity } from './entities/cover.entity';
import { CoverService } from './services/cover.service';
import { SeriesEntity } from './entities/series.entity';
import { SeriesService } from './services/series.service';
import { S3Service } from 'src/app/services/s3.service';
import { DeveloperEntity } from './entities/developer.entity';
import { PublisherEntity } from './entities/publisher.entity';
import { GametypeEntity } from './entities/gametype.entity';
import { DeveloperService } from './services/developer.service';
import { PublisherService } from './services/publisher.service';
import { GametypeService } from './services/gametype.service';

@Module({
  imports: [
    TypeOrmPlugin.forFeature([
      GameEntity,
      PlatformEntity,
      GenreEntity,
      CoverEntity,
      SeriesEntity,
      DeveloperEntity,
      PublisherEntity,
      GametypeEntity,
    ]),
  ],
  providers: [
    S3Service,

    GameService,
    PlatformService,
    GenreService,
    CoverService,
    SeriesService,
    DeveloperService,
    PublisherService,
    GametypeService,
  ],
  exports: [
    GameService,
    PlatformService,
    GenreService,
    CoverService,
    SeriesService,
    DeveloperService,
    PublisherService,
    GametypeService,
  ],
})
export class GamesModule {}
