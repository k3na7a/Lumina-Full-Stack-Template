import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../models';
import { LocalStrategy } from './strategies/localauth.strategy';
import { AccessTokenStrategy } from './strategies/accesstoken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshtoken.strategy';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
