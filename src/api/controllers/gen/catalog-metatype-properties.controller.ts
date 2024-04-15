/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-metatype-properties.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateCatalogMetatypePropertyDto } from './../../dtos/create-catalog-metatype-property.dto';
import { UpdateCatalogMetatypePropertyDto } from './../../dtos/update-catalog-metatype-property.dto';
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogsService } from './../../services/catalogs.service';
import { MetatypesService } from './../../services/metatypes.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog metatype properties')
@Controller('catalog/:catalog/metatype/:metatype')
export class GenCatalogMetatypePropertiesController {
	constructor(
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly metatypesService: MetatypesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findOne(apiKey: ApiKeys, catalog: number, property: number, metatype: number) {
		const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, property, metatype);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, property: number, metatype: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto) {
		updateDto.metatype = metatype;
		updateDto.catalog = catalog;
		updateDto.property = property;
		return await this.catalogMetatypePropertiesService.transactional(async (em) => {
			const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			const metatypeIns = await this.metatypesService.findById(metatype);
			if(metatypeIns===null){
				throw new HttpException('Metatype not found', HttpStatus.CONFLICT);
			}
			const catalogIns = await this.catalogsService.findById(catalog);
			if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
				throw new HttpException('Catalog not found', HttpStatus.CONFLICT);
			}
			await this.validateUpdate(entity, apiKey, catalog, property, metatype, updateDto, em);
			if(entity!==null){
				return await this.catalogMetatypePropertiesService.update(entity, updateDto, em);
			} else {
				return await this.catalogMetatypePropertiesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, property: number, metatype: number) {
		return await this.catalogMetatypePropertiesService.transactional(async (em) => {
			const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, property, metatype, em);
			return await this.catalogMetatypePropertiesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, property: number, metatype: number, em: EntityManager) { }
	
}