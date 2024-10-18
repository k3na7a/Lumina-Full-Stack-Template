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

@Module({
  imports: [
    TypeOrmPlugin.forFeature([
      GameEntity,
      PlatformEntity,
      GenreEntity,
      CoverEntity,
    ]),
  ],
  providers: [GameService, PlatformService, GenreService, CoverService],
  exports: [GameService, PlatformService, GenreService, CoverService],
})
export class GamesModule {}
