import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PropertyTuningDto } from './api/dtos/property-tuning.dto'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
	  transform: true
  }));
  const config = new DocumentBuilder()
    .setTitle('Leveon API')
    .setDescription('Leveon API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
	  extraModels: [PropertyTuningDto],
	});
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}

bootstrap();
