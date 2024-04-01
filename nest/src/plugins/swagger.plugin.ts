import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const CONFIG = new DocumentBuilder()
  .setTitle('Nest Api Example')
  .setDescription('Example Nest REST API written by John Desjardins')
  .setVersion('1.0')
  .addBearerAuth(
    {
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token',
  )
  .build();

export class SwaggerPlugin {
  public static init(app: INestApplication, prefix: string): void {
    const document = SwaggerModule.createDocument(app, CONFIG);
    SwaggerModule.setup(`/${prefix}`, app, document);
  }
}
