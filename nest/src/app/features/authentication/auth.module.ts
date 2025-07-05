import { Module } from '@nestjs/common';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { EmailQueueModule } from 'src/app/queues/email/email.module';

@Module({
  imports: [EmailQueueModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
class AuthModule {}

export { AuthModule };
