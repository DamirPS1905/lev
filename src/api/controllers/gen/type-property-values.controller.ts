/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/type-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateTypePropertyValueDto } from './../../dtos/create-type-property-value.dto'
import { UpdateTypePropertyValueDto } from './../../dtos/update-type-property-value.dto'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogTypesService } from './../../services/catalog-types.service'
import { CatalogsService } from './../../services/catalogs.service'
import { TypePropertyValuesService } from './../../services/type-property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Type property values')
@Controller('catalog/:catalog/type/:type')
export class GenTypePropertyValuesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly typePropertyValuesService: TypePropertyValuesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, type: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.CONFLICT);
		}
		return await this.typePropertyValuesService.findAllByType(type);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, type: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.typePropertyValuesService.findByTypeAndProperty(type, property);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, type, property);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, type: number, property: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, type: number, property: number, updateDto: UpdateTypePropertyValueDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.typePropertyValuesService.transactional(async (em) => {
			const entity = await this.typePropertyValuesService.findByTypeAndProperty(type, property, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			const typeIns = await this.catalogTypesService.findById(type);
			if(typeIns===null || !(typeIns.catalog.id===catalog)){
				throw new HttpException('Product type not found', HttpStatus.CONFLICT);
			}
			await this.validateUpdate(entity, apiKey, catalog, type, property, updateDto, em);
			if(entity!==null){
				return await this.typePropertyValuesService.update(entity, updateDto, em);
			} else {
				return await this.typePropertyValuesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, type: number, property: number, updateDto: UpdateTypePropertyValueDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, type: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.typePropertyValuesService.transactional(async (em) => {
			const entity = await this.typePropertyValuesService.findByTypeAndProperty(type, property, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, type, property, em);
			return await this.typePropertyValuesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, type: number, property: number, em: EntityManager) { }
	
}