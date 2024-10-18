import { Module } from '@nestjs/common';

import { UserModule } from 'src/app/modules';
import { UserAdminController as UserController } from './controllers/user.controller';

@Module({
  imports: [UserModule],
  controllers: [UserController],
})
export class UserAdminModule {}
