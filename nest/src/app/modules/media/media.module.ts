import { Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { S3Service } from 'src/app/common/services/s3.service';

import { ImageEntity } from 'src/app/modules/media/entities/image.entity';
import { ImageService } from 'src/app/modules/media/services/image.service';

@Module({
  providers: [ImageService, S3Service],
  imports: [TypeOrmPlugin.forFeature([ImageEntity])],
  exports: [ImageService],
})
export class MediaModule {}
