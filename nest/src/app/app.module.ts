import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';
import { AccessTokenStrategy } from './authentication/strategies/accesstoken.strategy';
import { LocalStrategy } from './authentication/strategies/localauth.strategy';
import { RefreshTokenStrategy } from './authentication/strategies/refreshtoken.strategy';

@Module({
  imports: [
    TypeOrmPlugin.forRoot,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
  ],
  providers: [    
    AccessTokenStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ]
})
export class AppModule {}
