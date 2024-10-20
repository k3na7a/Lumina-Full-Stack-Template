import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { UserService } from './services/users.service';
import { ProfileService } from './services/profile.service';
import { AvatarService } from './services/avatar.service';
import { AvatarEntity } from './entities/avatar.entity';
import { ProfileEntity } from './entities/profile.entity';
import { UserEntity } from './entities/user.entity';
import { S3Service } from 'src/app/services/s3.service';

@Module({
  imports: [
    TypeOrmPlugin.forFeature([UserEntity, ProfileEntity, AvatarEntity]),
  ],
  controllers: [],
  providers: [UserService, ProfileService, AvatarService, S3Service],
  exports: [UserService, ProfileService, AvatarService],
})
export class UserModule {}
