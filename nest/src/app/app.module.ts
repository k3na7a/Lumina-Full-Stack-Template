import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { config } from 'dotenv';
config();

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './authentication/auth.module';
import { UserModule } from './users/users.module';
import { AccessTokenStrategy } from './authentication/strategies/accesstoken.strategy';
import { LocalStrategy } from './authentication/strategies/localauth.strategy';
import { RefreshTokenStrategy } from './authentication/strategies/refreshtoken.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmPlugin.forRoot,

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      serveRoot: '/',
    }),

    AuthModule,
    UserModule,
  ],
  providers: [AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy],
})
export class AppModule {}
