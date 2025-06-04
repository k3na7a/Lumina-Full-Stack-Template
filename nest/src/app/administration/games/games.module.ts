import { Module } from '@nestjs/common';
import { GamesModule } from 'src/app/games/games.module';
import { UserModule } from 'src/app/users/users.module';
import { GameAdminController } from './controllers/games.controller';
import { GamesAdminService } from './services/games.service';
import { MediaModule } from 'src/app/media/media.module';

@Module({
  imports: [GamesModule, UserModule, MediaModule],
  controllers: [GameAdminController],
  providers: [GamesAdminService],
  exports: [GamesAdminService],
})
export class GamesAdminModule {}
