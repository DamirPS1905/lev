import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UpdateCatalogDto } from './catalogs/dto/update-catalog.dto';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000);
}
let c = new UpdateCatalogDto();
console.log(c);
bootstrap();
