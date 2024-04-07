import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { PropertyValues } from './../../entities/PropertyValues'
import { TypePropertyValues } from './../../entities/TypePropertyValues'
import { CreateTypePropertyValueDto } from './../dtos/create-type-property-value.dto'
import { UpdateTypePropertyValueDto } from './../dtos/update-type-property-value.dto'
import { TypePropertyValuesService } from './../services/type-property-values.service'
import { GenTypePropertyValuesController } from './gen/type-property-values.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiExtraModels } from '@nestjs/swagger'

export class TypePropertyValuesController extends GenTypePropertyValuesController {
		
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const propertyIns = await this.catalogPropertiesService.findById(property);
		if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
			throw new HttpException('Property not found', HttpStatus.CONFLICT);
		}
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.CONFLICT);
		}
		if(propertyIns.multiple){
			return (await this.typePropertyValuesService.readValuesByTypeAndProperty(type, property))
				.map(p => p.value);
		}else{
			const val = await this.typePropertyValuesService.readValueByTypeAndProperty(type, property);
			if(val!==null) return val.value;
			else{
				throw new HttpException('Proprty value not setted', HttpStatus.NOT_FOUND);
			}
		}
	}
	
	@ApiExtraModels(Object, Array<Object>)
	@ApiBody({
	  schema: {
	    oneOf: [
	      {
	        type: 'object',
	      },
	      {
	        type: 'array',
	        items: {
		        type: 'object'
	        }
	      },
	    ],
	  },
	})	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: Object | Array<Object>) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.typePropertyValuesService.transactional(async (em) => {
			const entity = await this.typePropertyValuesService.findByTypeAndPropertyAndOrder(type, property, 0, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			const typeIns = await this.catalogTypesService.findById(type);
			if(typeIns===null || !(typeIns.catalog.id===catalog)){
				throw new HttpException('Product type not found', HttpStatus.CONFLICT);
			}
			if(propertyIns.options){
				if(propertyIns.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOneOption(type, property, updateDto[i], i, em);
						}
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOneOption(type, property, updateDto, 0, em);
				}
			}else{
				if(propertyIns.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOne(apiKey.company.id, type, propertyIns, updateDto[i], i, em);
						}
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOne(apiKey.company.id, type, propertyIns, updateDto, 0, em);
				}
			}
		});
	}
	
	async writeOne(company, type, propertyIns, value, order, em){
		try{
			const entity = await this.typePropertyValuesService.findByTypeAndPropertyAndOrder(type, propertyIns.id, order, em);
			let valKey = entity===null? null: entity.value;
			const val = await this.propertyTypesService.validateSingleValue(company, propertyIns.scheme, value);
			if(valKey===null){
				const conn = em.getConnection();
				valKey = (await conn.execute(`SELECT nextval('property_value_id')::int8 as res`))[0].res;
			}
			console.log(valKey)
			console.log(propertyIns.type.id)
			console.log(val)
			await em.upsert(PropertyValues, {
				valueKey: valKey,
				type: propertyIns.type.id,
				value: val
			});
			if(entity===null){
				await em.upsert(TypePropertyValues, {
					type: type,
					property: propertyIns.id,
					order: order,
					value: valKey,
				});
			}
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	async writeOneOption(type, property, value, order, em){
		try{
			const option = await this.optionsPropertyValuesService.findByValue(value);
			if(option===null || option.property.id!==property){
				throw new Error(`Option ${value} not found`);
			}
			await em.upsert(TypePropertyValues, {
				type: type,
				property: property,
				order: order,
				value: option.value,
			});
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.typePropertyValuesService.transactional(async (em) => {
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			const list = await this.typePropertyValuesService.findAllByTypeAndProperty(type, property, em);
			if(!propertyIns.options){
				for(let item of list){
					em.remove(em.getReference(PropertyValues, item.value));
				}
			}
			await em.remove(list).flush();
		});	
	}
	
}