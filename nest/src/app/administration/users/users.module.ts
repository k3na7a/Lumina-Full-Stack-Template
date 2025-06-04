import { Module } from '@nestjs/common';
import { UserModule } from 'src/app/users/users.module';
import { UserAdminController } from './controllers/user.controller';
import { UserAdminService } from './services/users.service';

@Module({
  imports: [UserModule],
  controllers: [UserAdminController],
  providers: [UserAdminService],
  exports: [UserAdminService],
})
export class UserAdminModule {}
