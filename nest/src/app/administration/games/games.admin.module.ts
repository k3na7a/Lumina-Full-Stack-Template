import { Module } from '@nestjs/common';
import { GamesModule } from 'src/app/games/games.module';
import { UserModule } from 'src/app/users/users.module';
import { GameAdminController } from './controllers/games.admin.controller';
import { GamesAdminService } from './services/games.admin.service';
import { MediaModule } from 'src/app/media/media.module';
import { PlatformAdminService } from './services/platforms.admin.service';

@Module({
  imports: [GamesModule, UserModule, MediaModule],
  controllers: [GameAdminController,],
  providers: [GamesAdminService, PlatformAdminService],
  exports: [GamesAdminService, PlatformAdminService],
})
export class GamesAdminModule {}
