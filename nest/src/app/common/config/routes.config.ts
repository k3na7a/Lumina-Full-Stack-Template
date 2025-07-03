import { Routes } from '@nestjs/core';
import { AuthModule } from 'src/app/features/authentication/auth.module';
import { SettingsModule } from 'src/app/features/settings/settings.module';
import { UserAdminModule } from 'src/app/features/administration/users/users.module';
import { GamesAdminModule } from 'src/app/features/administration/games/games.module';
import { HealthModule } from 'src/app/features/health/health.module';

export const appRoutes: Routes = [
  {
    path: 'authentication',
    children: [AuthModule],
  },
  {
    path: 'settings',
    children: [SettingsModule],
  },
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
  {
    path: 'health-check',
    children: [HealthModule],
  },
];
