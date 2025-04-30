import { Module } from '@nestjs/common';

import { UserAdminController } from './controllers/user.controller';
import { UserModule } from 'src/app/users/users.module';

@Module({
  imports: [UserModule],
  controllers: [UserAdminController],
})
export class AdminModule {}
