/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/options-property-values.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateOptionsPropertyValueDto } from './../../dtos/create-options-property-value.dto'
import { UpdateOptionsPropertyValueDto } from './../../dtos/update-options-property-value.dto'
import { CatalogPropertiesService } from './../../services/catalog-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OptionsPropertyValuesService } from './../../services/options-property-values.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Options property values')
@Controller('catalog/:catalog/options-property-value')
export class GenOptionsPropertyValuesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.optionsPropertyValuesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.optionsPropertyValuesService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, id: number) { }
	
	async create(apiKey: ApiKeys, catalog: number, createDto: CreateOptionsPropertyValueDto) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.optionsPropertyValuesService.transactional(async (em) => {
			const existed1 = await this.optionsPropertyValuesService.findByPropertyAndHash(createDto.property, createDto.hash, em);
			if(existed1!==null){
				throw new HttpException('Duplicate (property, hash)', HttpStatus.CONFLICT);
			}
			const propertyIns1 = await this.catalogPropertiesService.findById(createDto.property);
			if(propertyIns1===null || !(propertyIns1.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, createDto, em);
			return await this.optionsPropertyValuesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateOptionsPropertyValueDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateOptionsPropertyValueDto) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findById(id, em);
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id)){
				const propertyIns2 = await this.catalogPropertiesService.findById(updateDto.property);
				if(propertyIns2===null || !(propertyIns2.catalog.id===catalog)){
					throw new HttpException('Property not found', HttpStatus.CONFLICT);
				}
			}
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id) || (updateDto.hash!==undefined && updateDto.hash!==entity.hash)){
				const existed1 = await this.optionsPropertyValuesService.findByPropertyAndHash(updateDto.property, updateDto.hash, em);
				if(existed1!==null && (entity.id !== existed1.id)){
					throw new HttpException('Duplicate (property, hash)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, id, updateDto, em);
			return await this.optionsPropertyValuesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateOptionsPropertyValueDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, id: number) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, id, em);
			return await this.optionsPropertyValuesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, id: number, em: EntityManager) { }
	
}