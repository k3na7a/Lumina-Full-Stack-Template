import { Module } from '@nestjs/common';
import { SeederService } from './services/seeder.service';
import { PermissionSeeder } from './seeders/permissions.seeder';

@Module({
  providers: [SeederService, PermissionSeeder],
  exports: [SeederService],
})
export class SeederModule {}
