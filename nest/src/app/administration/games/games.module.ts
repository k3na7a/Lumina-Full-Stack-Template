import { Module } from '@nestjs/common';

import { UserModule } from 'src/app/modules';
import { GamesModule } from 'src/app/modules/games/games.module';

import { PlatformController } from './controllers/platform.controller';
import { GameController } from './controllers/game.controller';
import { GenreController } from './controllers/genre.controller';

@Module({
  imports: [UserModule, GamesModule],
  controllers: [GameController, PlatformController, GenreController],
})
export class GamesAdminModule {}
