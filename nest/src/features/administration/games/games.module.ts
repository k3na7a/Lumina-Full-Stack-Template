import { Module } from '@nestjs/common';

import { GamesModule } from 'src/modules/games/games.module';
import { MediaModule } from 'src/modules/media/media.module';
import { UserModule } from 'src/modules/users/users.module';

import { GameAdminController } from 'src/features/administration/games/controllers/games.controller';
import { PlatformAdminController } from 'src/features/administration/games/controllers/platforms.controller';
import { GamesAdminService } from 'src/features/administration/games/services/games.service';
import { PlatformAdminService } from 'src/features/administration/games/services/platforms.service';

@Module({
  imports: [GamesModule, UserModule, MediaModule],
  controllers: [GameAdminController, PlatformAdminController],
  providers: [GamesAdminService, PlatformAdminService],
  exports: [GamesAdminService, PlatformAdminService],
})
export class GamesAdminModule {}
