import { Global, Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { MediaModule } from 'src/modules/media/media.module';
import { UserService } from 'src/modules/users/services/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ProfileService } from 'src/modules/users/services/profile.service';
import { ProfileEntity } from 'src/modules/users/entities/profile.entity';
import { UserAccountService } from './services/users-account.service';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './services/roles.service';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionService } from './services/permissions.service';

@Global()
@Module({
  imports: [
    TypeOrmPlugin.forFeature([
      UserEntity,
      ProfileEntity,
      RoleEntity,
      PermissionEntity,
    ]),
    MediaModule,
  ],
  providers: [
    UserService,
    ProfileService,
    UserAccountService,
    RoleService,
    PermissionService,
  ],
  exports: [
    UserService,
    UserAccountService,
    ProfileService,
    RoleService,
    PermissionService,
  ],
})
export class UserModule {}
