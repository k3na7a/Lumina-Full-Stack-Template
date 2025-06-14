import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '../users/users.module';
import { ProfileAuthController } from './controllers/auth.profile.controller';

@Module({
  imports: [UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController, ProfileAuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
