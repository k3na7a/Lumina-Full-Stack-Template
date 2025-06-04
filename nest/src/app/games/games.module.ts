import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { MediaModule } from '../media/media.module';
import { GameEntity } from './entities/game.entity';
import { GameService } from './services/games.service';
import { AssetsEntity } from './entities/assets.entity';
import { AssetsService } from './services/assets.service';

@Module({
  imports: [TypeOrmPlugin.forFeature([GameEntity, AssetsEntity]), MediaModule],
  providers: [GameService, AssetsService],
  exports: [GameService, AssetsService],
})
export class GamesModule {}
