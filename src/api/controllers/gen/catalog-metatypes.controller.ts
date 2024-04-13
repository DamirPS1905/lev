/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-metatypes.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateCatalogMetatypeDto } from './../../dtos/create-catalog-metatype.dto';
import { UpdateCatalogMetatypeDto } from './../../dtos/update-catalog-metatype.dto';
import { CatalogMetatypesService } from './../../services/catalog-metatypes.service';
import { CatalogsService } from './../../services/catalogs.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog metatypes')
@Controller('catalog/:catalog/catalog-metatype')
export class GenCatalogMetatypesController {
	constructor(
		protected readonly catalogMetatypesService: CatalogMetatypesService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogMetatypesService.findAllByCatalog(catalog);
	}
	
}