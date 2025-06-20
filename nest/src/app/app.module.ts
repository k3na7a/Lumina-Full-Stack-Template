import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { AccessTokenStrategy } from 'src/app/common/strategies/accesstoken.strategy';
import { LocalStrategy } from 'src/app/common/strategies/localauth.strategy';
import { RefreshTokenStrategy } from 'src/app/common/strategies/refreshtoken.strategy';
import { UserModule } from 'src/app/modules/users/users.module';

import { AuthModule } from 'src/app/features/authentication/auth.module';
import { AdminModule } from 'src/app/features/administration/admin.module';
import { GamesAdminModule } from 'src/app/features/administration/games/games.module';
import { UserAdminModule } from 'src/app/features/administration/users/users.module';
import { SettingsModule } from 'src/app/features/settings/settings.module';

const rootPath = join(__dirname, '../..', 'public');
const serveRoot = '/';
const envFilePath = '.env';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    ServeStaticModule.forRoot({ rootPath, serveRoot }),

    TypeOrmPlugin.forRoot,
    UserModule,

    AuthModule,
    SettingsModule,
    AdminModule,

    RouterModule.register([
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
    ]),
  ],
  providers: [AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy],
})
export class AppModule {}
