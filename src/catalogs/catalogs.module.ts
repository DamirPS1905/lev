import { Module } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { CatalogsController } from './catalogs.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Catalogs } from '../entities/Catalogs';

@Module({
	imports: [MikroOrmModule.forFeature([Catalogs])],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
