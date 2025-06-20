import { Module } from '@nestjs/common';

import { UserAdminModule } from './users/users.module';
import { GamesAdminModule } from './games/games.module';

@Module({
  imports: [UserAdminModule, GamesAdminModule],
})
class AdminModule {}

export { AdminModule };
