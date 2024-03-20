import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';

import { AuthModule } from './authentication/auth.module';
import { UserModule } from './models/users/users.module';

@Module({
  imports: [
    TypeOrmPlugin.forRoot,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
