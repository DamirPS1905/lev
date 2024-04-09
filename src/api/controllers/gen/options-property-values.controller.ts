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
import { PropertyTypesService } from './../../services/property-types.service'
import { PropertyValuesService } from './../../services/property-values.service'
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
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly propertyValuesService: PropertyValuesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.optionsPropertyValuesService.listAll(offset, limit);
	}
	
	async update(apiKey: ApiKeys, catalog: number, value: bigint, updateDto: UpdateOptionsPropertyValueDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findByValue(value, em);
			if(updateDto.property!==undefined){
				const propertyIns = await this.catalogPropertiesService.findById(updateDto.property);
				if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
					throw new HttpException('Property not found', HttpStatus.CONFLICT);
				}
			}
			const tmp = await this.propertyValuesService.findByValueKey(updateDto.value, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (value)', HttpStatus.CONFLICT);
			}
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.property!==undefined && updateDto.property!==entity.property.id) || (updateDto.hash!==undefined && updateDto.hash!==entity.hash)){
				const existed = await this.optionsPropertyValuesService.findByPropertyAndHash(updateDto.property, updateDto.hash, em);
				if(existed!==null && (entity.value!==existed.value)){
					throw new HttpException('Duplicate (property, hash)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, value, updateDto, em);
			return await this.optionsPropertyValuesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, value: bigint, updateDto: UpdateOptionsPropertyValueDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, value: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findByValue(value, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, value, em);
			return await this.optionsPropertyValuesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, value: bigint, em: EntityManager) { }
	
}