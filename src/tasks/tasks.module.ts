import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  controllers: [ImagesController],
  providers: [MikroOrmModule, ImagesService],
})
export class TasksModule {}
