import { Module } from '@nestjs/common';

import { UserModule } from 'src/app/modules';
import { UserAdminController as UserController } from './controllers/user.controller';
import { UserAdminService as UserService } from './services/user.service';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class AdminModule {}
