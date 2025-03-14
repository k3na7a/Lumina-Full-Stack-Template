import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { config } from 'dotenv';
config();

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './modules/authentication/auth.module';
import { UserModule } from './modules/users/users.module';
import { AccessTokenStrategy } from './modules/authentication/strategies/accesstoken.strategy';
import { LocalStrategy } from './modules/authentication/strategies/localauth.strategy';
import { RefreshTokenStrategy } from './modules/authentication/strategies/refreshtoken.strategy';
import { AdminModule } from './modules/administration/admin.module';

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
    AdminModule,
    UserModule,
  ],
  providers: [AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy],
})
export class AppModule {}
