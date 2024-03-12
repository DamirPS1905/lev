import { Module } from '@nestjs/common';
import { CatalogTypesService } from './catalog-types.service';
import { CatalogTypesOverloadService } from './catalog-types-overload.service';
import { CatalogTypesController } from './catalog-types.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CatalogTypesOverload } from '../entities/CatalogTypesOverload';
import { CatalogTypes } from '../entities/CatalogTypes';
import { Catalogs } from '../entities/Catalogs';

@Module({
	imports: [MikroOrmModule.forFeature([CatalogTypes, CatalogTypesOverload, Catalogs])],
  controllers: [CatalogTypesController],
  providers: [CatalogTypesService, CatalogTypesOverloadService],
})
export class CatalogTypesModule {}
