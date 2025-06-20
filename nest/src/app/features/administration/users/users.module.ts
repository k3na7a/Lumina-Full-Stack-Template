import { Module } from '@nestjs/common';
import { UserAdminController } from './controllers/user.controller';
import { UserAdminService } from './services/users.service';

@Module({
  controllers: [UserAdminController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
