import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { config } from 'dotenv';
config();

import { AppModule } from 'src/app/app.module';
import { SwaggerPlugin } from 'src/plugins/swagger.plugin';
import { SendGridPlugin } from 'src/app/queues/email/sendgrid.plugin';
import { BullBoardPlugin } from './plugins/bull-board.plugin';
import { GlobalExceptionFilter } from './app/common/filters/global-exceptions.filter';
import { LogService } from './app/queues/logging/services/log.service';
import { RequestContextInterceptor } from './app/common/interceptors/request-context.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const logService = app.get(LogService);
  const requestConfigInterceptor = app.get(RequestContextInterceptor);

  const logger = new Logger('NestApplication');

  const prefix = process.env.GLOBAL_PREFIX || 'api';
  const port = process.env.PORT || 3000;

  const bullboard_prefix = 'queue-jobs';

  app.use(helmet());
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter(logService));
  app.useGlobalInterceptors(requestConfigInterceptor);
  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  });

  SwaggerPlugin.init(app, prefix);
  BullBoardPlugin.init(app, `/${bullboard_prefix}`);
  SendGridPlugin.init();

  await app.listen(port);

  logger.log(
    `🚀 Application is running on: http://localhost:${port}/${prefix}`,
  );
  logger.log(
    `📊 BullBoard is available at: http://localhost:${port}/${bullboard_prefix}`,
  );
}

bootstrap();
