import { Module } from '@nestjs/common';

import { UserAdminModule } from './users/users.module';
import { GamesAdminModule } from './games/games.module';
import { AuditAdminModule } from './audit/audit.module';

@Module({
  imports: [UserAdminModule, GamesAdminModule, AuditAdminModule],
})
class AdminModule {}

export { AdminModule };
