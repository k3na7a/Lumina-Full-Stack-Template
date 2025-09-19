import { Module } from '@nestjs/common';
import { AuditAdminController } from './controllers/audit.controller';

@Module({
  controllers: [AuditAdminController],
})
export class AuditAdminModule {}
