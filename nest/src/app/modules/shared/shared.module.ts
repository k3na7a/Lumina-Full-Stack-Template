import { Global, Module } from '@nestjs/common';
import { RequestContext } from 'src/app/common/providers/request-context.provider';
import { S3Service } from './services/s3.service';

@Global()
@Module({
  providers: [RequestContext, S3Service],
  exports: [RequestContext, S3Service],
})
export class CoreModule {}
