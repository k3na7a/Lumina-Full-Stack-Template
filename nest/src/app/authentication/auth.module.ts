import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../users/users.module';
import { AccountController } from './controllers/account.controller';
import { ProfileController } from './controllers/profile.controller';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController, AccountController, ProfileController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
