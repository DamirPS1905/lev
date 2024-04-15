import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateOptionsPropertyValueDto } from './../dtos/create-options-property-value.dto'
import { UpdateOptionsPropertyValueDto } from './../dtos/update-options-property-value.dto'
import { OptionsPropertyValuesService } from './../services/options-property-values.service'
import { GenOptionsPropertyValuesController } from './gen/options-property-values.controller'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiBody, ApiExtraModels, ApiHeader, ApiTags } from '@nestjs/swagger'
import { createHash } from 'crypto'
import { PropertyValues } from './../../entities/PropertyValues'
import { CatalogPropertiesService } from './../services/catalog-properties.service'
import { CatalogsService } from './../services/catalogs.service'
import { PropertyTypesService } from './../services/property-types.service'
import { PropertyValuesService } from './../services/property-values.service'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Options property values')
@Controller('catalog/:catalog/property/:property/option')
export class OptionsPropertyValuesController {
	
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly propertyValuesService: PropertyValuesService,
	) { }

	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		await this.validatePath(actor, catalog, property);
		return await this.optionsPropertyValuesService.readAllByProperty(property, offset, limit);
	}
	
	@Get(':value')
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Param('value', ParseBigIntPipe) value: bigint) {
		await this.validatePath(actor, catalog, property);
		const optionIns = await this.optionsPropertyValuesService.findByValue(value);
		if(optionIns===null || optionIns.property.id!==property){
			throw new HttpException('Option not found', HttpStatus.NOT_FOUND);
		}
		await wrap(optionIns.value).init();
		return optionIns.value;
	}
	
	@ApiExtraModels(Object, Array<Object>)
	@ApiBody({
	  schema: {
	    oneOf: [
	      {type: 'object'},
	      {
	        type: 'array',
	        items: {type: 'object'}
	      },
	    ],
	  },
	})
	@Post()
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Body() createDto: Object | Array<Object>) {
		const propertyIns = await this.validatePath(actor, catalog, property),
					val = await this.propertyTypesService.validateSingleValue(actor.company.id, propertyIns.scheme, createDto),
					json = JSON.stringify(val, Object.keys(val).sort()),
					hash = createHash('sha256').update(json).digest('base64');
		return this.optionsPropertyValuesService.transactional(async (em) => {
			const existed = await this.optionsPropertyValuesService.findByPropertyAndHash(property, hash, em);
			if(existed!==null){
				throw new HttpException('Duplicate option', HttpStatus.CONFLICT);
			}
			const conn = em.getConnection(),
						valKey = (await conn.execute(`SELECT nextval('property_value_id')::int8 as res`))[0].res;
			const result = await em.upsert(PropertyValues, {
				valueKey: valKey,
				type: propertyIns.type.id,
				value: val
			});
			const dto = new CreateOptionsPropertyValueDto();
			dto.property = property;
			dto.value = valKey;
			dto.hash = hash;
			await this.optionsPropertyValuesService.create(dto, em);
			return result;
		});
		
	}
	
	@ApiExtraModels(Object, Array<Object>)
	@ApiBody({
	  schema: {
	    oneOf: [
	      {type: 'object'},
	      {
	        type: 'array',
	        items: {type: 'object'}
	      },
	    ],
	  },
	})
	@Patch(':value')
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Param('value', ParseBigIntPipe) value: bigint, @Body() updateDto: Object | Array<Object>) {
		const propertyIns = await this.validatePath(actor, catalog, property),
					val = await this.propertyTypesService.validateSingleValue(actor.company.id, propertyIns.scheme, updateDto),
					json = JSON.stringify(val, Object.keys(val).sort()),
					hash = createHash('sha256').update(json).digest('base64');
		return this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findByValue(value, em);
			if(entity===null || entity.property.id!==property){
				throw new HttpException('Option not found', HttpStatus.NOT_FOUND);
			}
			const existed = await this.optionsPropertyValuesService.findByPropertyAndHash(property, hash, em);
			if(existed!==null && existed.value!==entity.value){
				throw new HttpException('Duplicate option', HttpStatus.CONFLICT);
			}
			return await em.upsert(PropertyValues, {
				valueKey: value,
				type: propertyIns.type.id,
				value: val
			});
		});
	}
	
	@Delete(':value')
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Param('value', ParseBigIntPipe) value: bigint) {
		await this.validatePath(actor, catalog, property);
		return this.optionsPropertyValuesService.transactional(async (em) => {
			const entity = await this.optionsPropertyValuesService.findByValue(value, em);
			if(entity===null || entity.property.id!==property){
				throw new HttpException('Option not found', HttpStatus.NOT_FOUND);
			}
			await wrap(entity.value).init();
			return await this.propertyValuesService.remove(entity.value, em);
		});
	}
	
	private async validatePath(actor: Actors, catalog: number, property: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==actor.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const propertyIns = await this.catalogPropertiesService.findById(property);
		if(propertyIns===null || propertyIns.catalog.id!==catalog){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
		}
		if(!propertyIns.options){
			throw new HttpException('Property is not optional', HttpStatus.CONFLICT);
		}
		return propertyIns;
	}
	
}