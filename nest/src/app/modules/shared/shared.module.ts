import { Global, Module } from '@nestjs/common';
import { RequestContext } from 'src/app/common/providers/request-context.provider';

@Global()
@Module({
  providers: [RequestContext],
  exports: [RequestContext],
})
export class CoreModule {}
