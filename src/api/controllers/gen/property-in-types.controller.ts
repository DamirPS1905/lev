/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-in-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreatePropertyInTypeDto } from './../../dtos/create-property-in-type.dto'
import { UpdatePropertyInTypeDto } from './../../dtos/update-property-in-type.dto'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogTypesService } from './../../services/catalog-types.service'
import { CatalogsService } from './../../services/catalogs.service'
import { PropertyInTypesService } from './../../services/property-in-types.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property in types')
@Controller('catalog/:catalog/type/:type/property')
export class GenPropertyInTypesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyInTypesService: PropertyInTypesService,
	) { }
	
	async findOne(apiKey: ApiKeys, catalog: number, type: number, property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property);
		if(entity===null || !(entity.type.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, type, property);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, type: number, property: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto) {
		updateDto.type = type;
		updateDto.property = property;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.transactional(async (em) => {
			const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property, em);
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id)){
				const propertyIns1 = await this.catalogPropertiesService.findById(updateDto.property);
				if(propertyIns1===null || !(propertyIns1.catalog.id===catalog)){
					throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
				}
			}
			if((updateDto.type!==undefined && updateDto.type!==entity.type.id)){
				const typeIns2 = await this.catalogTypesService.findById(updateDto.type);
				if(typeIns2===null || !(typeIns2.catalog.id===catalog)){
					throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
				}
			}
			await this.validateUpdate(entity, apiKey, catalog, type, property, updateDto, em);
			if(entity!==null){
				if(!(entity.type.catalog.id===catalog)){
					throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
				}
				return await this.propertyInTypesService.update(entity, updateDto, em);
			} else {
				return await this.propertyInTypesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, type: number, property: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.transactional(async (em) => {
			const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property, em);
			if(entity===null || !(entity.type.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, type, property, em);
			return await this.propertyInTypesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, type: number, property: number, em: EntityManager) { }
	
}