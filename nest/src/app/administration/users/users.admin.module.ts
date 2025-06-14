import { Module } from '@nestjs/common';
import { UserModule } from 'src/app/users/users.module';
import { UserAdminController } from './controllers/user.admin.controller';
import { UserAdminService } from './services/users.admin.service';

@Module({
  imports: [UserModule],
  controllers: [UserAdminController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
