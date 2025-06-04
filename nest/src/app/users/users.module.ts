import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { UserService } from './services/users.service';
import { UserEntity } from './entities/user.entity';
import { MediaModule } from '../media/media.module';
import { ProfileService } from './services/profile.service';
import { ProfileEntity } from './entities/profile.entity';

@Module({
  imports: [TypeOrmPlugin.forFeature([UserEntity, ProfileEntity]), MediaModule],
  providers: [UserService, ProfileService],
  exports: [UserService, ProfileService],
})
export class UserModule {}
