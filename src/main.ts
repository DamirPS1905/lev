import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { PropertyTuningDto } from './api/dtos/property-tuning.dto';
import { AppModule } from './app.module';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000', 'http://example3.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'Authorization', 'X-API-KEY'],
    exposedHeaders: ['Authorization', 'X-API-KEY'],
    credentials: true,
  });

  //Swagger configuration
  const config = new DocumentBuilder()
    .setTitle(process.env.PROJECT_TITLE)
    .setDescription(process.env.PROJECT_DESCRIPTION)
    .setVersion(process.env.VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PropertyTuningDto],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
