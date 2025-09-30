import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { MediaModule } from 'src/modules/media/media.module';

import { GameEntity } from 'src/modules/games/entities/game.entity';
import { PlatformEntity } from 'src/modules/games/entities/platform.entity';
import { GameService } from 'src/modules/games/services/games.service';
import { PlatformService } from 'src/modules/games/services/platforms.service';

@Module({
  providers: [GameService, PlatformService],
  imports: [
    TypeOrmPlugin.forFeature([GameEntity, PlatformEntity]),
    MediaModule,
  ],
  exports: [GameService, PlatformService],
})
export class GamesModule {}
