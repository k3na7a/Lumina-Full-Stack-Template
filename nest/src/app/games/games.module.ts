import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { MediaModule } from '../media/media.module';
import { GameEntity } from './entities/game.entity';
import { GameService } from './services/games.service';
import { PlatformEntity } from './entities/platform.entity';
import { PlatformService } from './services/platforms.service';

@Module({
  imports: [
    TypeOrmPlugin.forFeature([GameEntity, PlatformEntity]),
    MediaModule,
  ],
  providers: [GameService, PlatformService],
  exports: [GameService, PlatformService],
})
export class GamesModule {}
