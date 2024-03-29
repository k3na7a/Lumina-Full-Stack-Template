import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { UserService } from './services/users.service';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmPlugin.forFeature([UserEntity])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
