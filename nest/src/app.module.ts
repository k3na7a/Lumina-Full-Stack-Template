import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';

import { TypeOrmPlugin } from 'src/plugins/typeorm.plugin';
import { AccessTokenStrategy } from 'src/common/strategies/accesstoken.strategy';
import { LocalStrategy } from 'src/common/strategies/localauth.strategy';
import { RefreshTokenStrategy } from 'src/common/strategies/refreshtoken.strategy';
import { UserModule } from 'src/modules/users/users.module';

import { AuthModule } from 'src/features/authentication/auth.module';
import { AdminModule } from 'src/features/administration/admin.module';
import { SettingsModule } from 'src/features/settings/settings.module';
import { connection } from 'src/config/redis.config';
import { LogQueueModule } from './queues/logging/log-queue.module';
import { validationSchema } from 'src/config/env-validation.config';
import { HealthModule } from './features/health/health.module';
import { RequestContextMiddleware } from './common/middleware/request-context.middleware';
import { ThrottlerModule } from '@nestjs/throttler';
import { minute } from '@lib/constants/time.constants';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import { CoreModule } from './modules/shared/shared.module';
import { ConnectionLogger } from './common/loggers/connection.logger';
import { DataSource } from 'typeorm';
import { LogService } from './queues/logging/services/log.service';
import { AuditModule } from './modules/audit/audit.module';
import { EmailQueueModule } from './queues/email/email.module';
import { RouterPlugin } from './plugins/router.plugin';
import { SeederModule } from './modules/seeds/seeder.module';

const rootPath = join(__dirname, '../..', 'public');
const serveRoot = '/';
const envFilePath = '.env';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath, validationSchema }),
    ServeStaticModule.forRoot({ rootPath, serveRoot }),
    BullModule.forRoot({ connection }),
    RouterPlugin.register(),
    TypeOrmPlugin.forRoot,
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 1 * minute, limit: 20 }] }),

    // QUEUES
    LogQueueModule,
    EmailQueueModule,

    // MODULES
    CoreModule,
    UserModule,
    AuditModule,
    SeederModule,

    // FEATURES
    HealthModule,
    AuthModule,
    SettingsModule,
    AdminModule,
  ],
  providers: [
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,

    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },

    {
      provide: ConnectionLogger,
      useFactory: (dataSource: DataSource, logService: LogService) => {
        return new ConnectionLogger(dataSource, logService);
      },
      inject: [DataSource, LogService],
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
