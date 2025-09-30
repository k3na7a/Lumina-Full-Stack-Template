import { Global, Module } from '@nestjs/common';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuditEntity } from './entities/audit.entity';
import { AuditService } from './service/audit.service';

@Global()
@Module({
  imports: [TypeOrmPlugin.forFeature([AuditEntity])],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
