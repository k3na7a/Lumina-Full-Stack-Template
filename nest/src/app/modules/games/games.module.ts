import { Module } from '@nestjs/common';
import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { PlatformEntity } from './entities/platform.entity';

@Module({
  imports: [TypeOrmPlugin.forFeature([PlatformEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class GamesModule {}
