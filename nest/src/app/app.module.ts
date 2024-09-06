import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';
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
