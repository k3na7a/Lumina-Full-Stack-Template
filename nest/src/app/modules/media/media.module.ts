import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { ImageService } from 'src/app/modules/media/services/image.service';

@Module({
  providers: [ImageService],
  imports: [TypeOrmPlugin.forFeature([ImageEntity])],
  exports: [ImageService],
})
export class MediaModule {}
