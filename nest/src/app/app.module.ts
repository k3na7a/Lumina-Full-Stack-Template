import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './authentication/auth.module';
import { UserModule } from './modules/users/users.module';
import { AccessTokenStrategy } from './authentication/strategies/accesstoken.strategy';
import { LocalStrategy } from './authentication/strategies/localauth.strategy';
import { RefreshTokenStrategy } from './authentication/strategies/refreshtoken.strategy';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './administration/admin.module';

@Module({
  imports: [
    TypeOrmPlugin.forRoot,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/',
    }),

    AuthModule,
    AdminModule,

    UserModule,

    RouterModule.register([
      {
        path: 'auth',
        module: AuthModule,
      },
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
  ],
  providers: [AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy],
})
export class AppModule {}
