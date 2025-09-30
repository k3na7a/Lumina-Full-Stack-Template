import { Module } from '@nestjs/common';

import { MediaModule } from 'src/modules/media/media.module';

import { UserAdminController } from './controllers/user.controller';
import { UserAdminService } from './services/users.service';
import { RoleAdminService } from './services/role.service';
import { RoleAdminController } from './controllers/role.controller';
import { PermissionAdminService } from './services/permission.service';
import { PermissionAdminController } from './controllers/permission.controller';

@Module({
  imports: [MediaModule],
  controllers: [
    UserAdminController,
    RoleAdminController,
    PermissionAdminController,
  ],
  providers: [UserAdminService, RoleAdminService, PermissionAdminService],
  exports: [UserAdminService, RoleAdminService, PermissionAdminService],
})
export class UserAdminModule {}
