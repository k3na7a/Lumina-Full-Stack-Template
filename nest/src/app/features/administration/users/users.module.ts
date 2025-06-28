import { Module } from '@nestjs/common';
import { UserAdminController } from './controllers/user.controller';
import { UserAdminService } from './services/users.service';

import { MediaModule } from 'src/app/modules/media/media.module';

@Module({
  imports: [MediaModule],
  controllers: [UserAdminController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
