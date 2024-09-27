import { Module } from '@nestjs/common';

import { UserModule } from 'src/app/modules';
import { UserAdminController } from './controllers/user.controller';

@Module({
  imports: [UserModule],
  controllers: [UserAdminController],
  providers: [],
  exports: [],
})
export class AdminModule {}
