import { Module } from '@nestjs/common';

import { UserAdminModule } from './users/user.module';
import { RouterModule } from '@nestjs/core';
import { GamesAdminModule } from './games/games.module';

@Module({
  imports: [
    UserAdminModule,
    GamesAdminModule,

    RouterModule.register([
      {
        path: 'admin',
        children: [
          UserAdminModule,
          {
            path: 'game-library',
            children: [GamesAdminModule],
          },
        ],
      },
    ]),
  ],
})
export class AdminModule {}
