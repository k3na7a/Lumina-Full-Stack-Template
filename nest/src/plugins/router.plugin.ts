import { DynamicModule } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuditAdminModule } from 'src/features/administration/audit/audit.module';
import { GamesAdminModule } from 'src/features/administration/games/games.module';
import { UserAdminModule } from 'src/features/administration/users/users.module';
import { AuthModule } from 'src/features/authentication/auth.module';
import { HealthModule } from 'src/features/health/health.module';
import { SettingsModule } from 'src/features/settings/settings.module';

export class RouterPlugin {
  public static register(): DynamicModule {
    return RouterModule.register([
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
            path: 'audit-events',
            children: [AuditAdminModule],
          },
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
    ]);
  }
}
