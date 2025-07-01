import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

import { config } from 'dotenv';
config();

import { AppModule } from 'src/app/app.module';
import { SwaggerPlugin } from 'src/plugins/swagger.plugin';
import { SendGridPlugin } from 'src/plugins/sendgrid.plugin';
import { BullBoardPlugin } from './plugins/bull-board.plugin';
import { GlobalHttpExceptionFilter } from './app/common/filters/global-exceptions.filter';
import { LogService } from './app/modules/log/services/log.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logService = app.get(LogService);

  const prefix = process.env.GLOBAL_PREFIX || 'api';
  const port = process.env.PORT || 3000;

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new GlobalHttpExceptionFilter(logService));

  app.enableCors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization'],
    credentials: true,
  });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  SwaggerPlugin.init(app, prefix);
  BullBoardPlugin.init(app, '/queue-jobs');
  SendGridPlugin.init();

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${prefix}`,
    'NestApplication',
  );
}

bootstrap();
