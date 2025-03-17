import { Module } from '@nestjs/common';

import { UserAdminModule } from './users/user.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    UserAdminModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [UserAdminModule],
      },
    ]),
  ],
})
export class AdminModule {}
