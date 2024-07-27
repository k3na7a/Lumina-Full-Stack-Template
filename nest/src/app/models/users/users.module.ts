import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { UserService } from './services/users.service';
import { UserEntity } from 'src/library/entities/user.entity';
import { UserProfileService } from './services/profile.service';
import { ProfileEntity } from 'src/library/entities/profile.entity';

@Module({
  imports: [TypeOrmPlugin.forFeature([UserEntity, ProfileEntity])],
  controllers: [],
  providers: [UserService, UserProfileService],
  exports: [UserService, UserProfileService],
})
export class UserModule {}
