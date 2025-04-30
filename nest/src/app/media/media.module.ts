import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { ImageService } from './services/image.service';
import { ImageEntity } from './entities/image.entity';
import { S3Service } from 'src/app/media/services/s3.service';

@Module({
  imports: [TypeOrmPlugin.forFeature([ImageEntity])],
  providers: [ImageService, S3Service],
  exports: [ImageService],
})
export class MediaModule {}
