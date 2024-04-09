import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
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

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Options property values')
@Controller('catalog/:catalog/property/:property/option')
export class OptionsPropertyValuesController extends GenOptionsPropertyValuesController {
	
	@Get('all')
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(apiKey, catalog, offset, limit);
	}
	
	@Get(':value')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Param('value') value: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==apiKey.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const propertyIns = await this.catalogPropertiesService.findById(property);
		if(propertyIns===null || propertyIns.catalog.id!==catalog){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
		}
		if(!propertyIns.options){
			throw new HttpException('Property is not optional', HttpStatus.NOT_FOUND);
		}
		const valueIns = await this.optionsPropertyValuesService.findByValue(value);
		if(valueIns.property.id!==property){
			throw new HttpException('Option is not optional', HttpStatus.NOT_FOUND);
		}
		wrap(valueIns.value).init();
		return valueIns.value;
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
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('property') property: number, @Body() createDto: Object | Array<Object>) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==apiKey.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const propertyIns = await this.catalogPropertiesService.findById(property);
		if(propertyIns===null || propertyIns.catalog.id!==catalog){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
		}
		if(!propertyIns.options){
			throw new HttpException('Property is not optional', HttpStatus.NOT_FOUND);
		}
		const val = await this.propertyTypesService.validateSingleValue(apiKey.company.id, propertyIns.scheme, createDto),
					json = JSON.stringify(val, Object.keys(val).sort()),
					hash = createHash('sha256').update(json).digest('base64');
		console.log(val);
		console.log(json);
		console.log(hash);
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
	
	@Patch(':value')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('value') value: bigint, @Body() updateDto: UpdateOptionsPropertyValueDto) {
		return await super.update(apiKey, catalog, value, updateDto);
	}
	
	@Delete(':value')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('value') value: bigint) {
		return await super.delete(apiKey, catalog, value);
	}
	
	
}