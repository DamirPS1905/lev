import { Module } from '@nestjs/common';
import { CatalogBrandsService } from './../api/services/catalog-brands.service';
import { CatalogBrandsController } from './../api/controllers/catalog-brands.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CatalogBrands } from '../entities/CatalogBrands';
import { Catalogs } from '../entities/Catalogs';

@Module({
	//imports: [MikroOrmModule.forFeature([CatalogBrands, Catalogs])],
  controllers: [CatalogBrandsController],
  providers: [CatalogBrandsService],
})
export class CatalogBrandsModule {}
