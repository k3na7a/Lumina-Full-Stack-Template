import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { UserService } from './services/users.service';
import { UserEntity } from 'src/library/entities/user/user.entity';
import { ProfileService } from './services/profile.service';
import { ProfileEntity } from 'src/library/entities/user/profile.entity';
import { AvatarEntity } from 'src/library/entities/user/avatar.entity';
import { AvatarService } from './services/avatar.service';

@Module({
  imports: [
    TypeOrmPlugin.forFeature([UserEntity, ProfileEntity, AvatarEntity]),
  ],
  controllers: [],
  providers: [UserService, ProfileService, AvatarService],
  exports: [UserService, ProfileService, AvatarService],
})
export class UserModule {}
