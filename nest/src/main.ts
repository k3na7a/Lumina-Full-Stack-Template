import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { config } from 'dotenv';
config();

import { AppModule } from 'src/app/app.module';
import { SwaggerPlugin } from 'src/plugins/swagger.plugin';
import { SendGridPlugin } from 'src/plugins/sendgrid.plugin';
import { BullBoardPlugin } from './plugins/bull-board.plugin';
import { GlobalExceptionFilter } from './app/common/filters/global-exceptions.filter';
import { LogService } from './app/queues/logging/services/log.service';
import { HttpInterceptor } from './app/common/interceptors/http.interceptor';
import { HelmetPlugin } from './plugins/helmet.plugin';

async function bootstrap(): Promise<void> {
  const httpsOptions = {
    key: fs.readFileSync('certs/localhost-key.pem'),
    cert: fs.readFileSync('certs/localhost.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });

  const logService = app.get(LogService);

  const logger = new Logger('NestApplication');

  const prefix = process.env.GLOBAL_PREFIX || 'api';
  const port = process.env.PORT || 3000;

  const bullboard_prefix = 'queue-jobs';

  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalExceptionFilter(logService));
  app.useGlobalInterceptors(new HttpInterceptor(logService));
  app.enableCors({
    origin: 'https://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    exposedHeaders: ['Authorization', 'Set-Cookie'],
    credentials: true,
  });

  HelmetPlugin.init(app);
  SwaggerPlugin.init(app, prefix);
  BullBoardPlugin.init(app, `/${bullboard_prefix}`);
  SendGridPlugin.init();

  await app.listen(port);

  logger.log(
    `🚀 Application is running on: https://localhost:${port}/${prefix}`,
  );
  logger.log(
    `📊 BullBoard is available at: https://localhost:${port}/${bullboard_prefix}`,
  );
}

bootstrap();
