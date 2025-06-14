import { Module } from '@nestjs/common';

import { UserAdminModule } from './users/users.admin.module';
import { GamesAdminModule } from './games/games.admin.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UserAdminModule,
    GamesAdminModule,

    RouterModule.register([
      {
        path: 'administration',
        children: [
          {
            path: 'user-management',
            children: [UserAdminModule],
          },
          {
            path: 'games-and-software',
            children: [GamesAdminModule],
          },
        ],
      },
    ]),
  ],
})
export class AdminModule {}
