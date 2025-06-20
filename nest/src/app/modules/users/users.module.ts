import { Global, Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { MediaModule } from 'src/app/modules/media/media.module';
import { UserService } from 'src/app/modules/users/services/users.service';
import { UserEntity } from 'src/app/modules/users/entities/user.entity';
import { ProfileService } from 'src/app/modules/users/services/profile.service';
import { ProfileEntity } from 'src/app/modules/users/entities/profile.entity';
import { UserAccountService } from './services/users-account.service';

@Global()
@Module({
  imports: [TypeOrmPlugin.forFeature([UserEntity, ProfileEntity]), MediaModule],
  providers: [UserService, ProfileService, UserAccountService],
  exports: [UserService, UserAccountService, ProfileService],
})
export class UserModule {}
