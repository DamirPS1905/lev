import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { PropertyValues } from './../../../entities/PropertyValues'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiExtraModels, ApiHeader } from '@nestjs/swagger'
import { IMetatypeVauesService } from './../../services/interface/i-metatype-values.service'
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service'
import { CatalogsService } from './../../services/catalogs.service'
import { OptionsPropertyValuesService } from './../../services/options-property-values.service'
import { PropertyTypesService } from './../../services/property-types.service'


@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
export class MetatypeValuesController<E, S extends IMetatypeVauesService> {
		
	constructor(
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly valuesService: S,
	) { }
	
	protected readonly metatype:number = 0;
	protected readonly entityName:string = "";
	
	async findAll(apiKey: ApiKeys, catalog: number, instance: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		this.validateInstance(catalog, instance);
		return (await this.valuesService.readValuesByInstance(instance))
			.map(p => {
				p.value.property = p.property;
				return p.value;
			});
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, instance: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const metaProperty = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, this.metatype);
		if(metaProperty===null){
			throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
		}
		this.validateInstance(catalog, instance);
		await wrap(metaProperty.property).init();
		if(metaProperty.property.multiple){
			return (await this.valuesService.readValuesByInstanceAndProperty(instance, property))
				.map(p => p.value);
		}else{
			const val = await this.valuesService.readValueByInstanceAndProperty(instance, property);
			if(val!==null) return val.value;
			else{
				throw new HttpException('Proprty value not setted', HttpStatus.NOT_FOUND);
			}
		}
	}
	
	protected validateInstance(catalog:number, instance:number, emt:EntityManager = null){}
	
	async update(apiKey: ApiKeys, catalog: number, instance: number, property: number, updateDto: Object | Array<Object>) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.valuesService.transactional(async (em) => {
			const metaProperty = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, this.metatype);
			this.validateInstance(catalog, instance, em);
			if(metaProperty===null){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
			}
			await wrap(metaProperty.property).init();
			if(metaProperty.property.options){
				if(metaProperty.property.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOneOption(instance, metaProperty, updateDto[i], i, em);
						}
						await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, metaProperty.property.id, updateDto.length, false, em);
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOneOption(instance, metaProperty, updateDto, 0, em);
				}
			}else{
				if(metaProperty.property.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOne(apiKey.company.id, instance, metaProperty, updateDto[i], i, em);
						}
						await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, metaProperty.property.id, updateDto.length, true, em);
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOne(apiKey.company.id, instance, metaProperty, updateDto, 0, em);
				}
			}
		});
	}
	
	async writeOne(company, instance, metaProperty, value, order, em){
		try{
			const entity = await this.valuesService.findByInstanceAndPropertyAndOrder(instance, metaProperty.property.id, order, em);
			let valKey = entity===null? null: entity.value;
			const val = await this.propertyTypesService.validateSingleValue(company, metaProperty.scheme, value);
			if(valKey===null){
				const conn = em.getConnection();
				valKey = (await conn.execute(`SELECT nextval('property_value_id')::int8 as res`))[0].res;
			}
			await em.upsert(PropertyValues, {
				valueKey: valKey,
				type: metaProperty.property.type.id,
				value: val
			});
			if(entity===null){
				await em.upsert(this.entityName, {
					instance: instance,
					property: metaProperty.property.id,
					order: order,
					value: valKey,
				});
			}
		}catch(e){
			console.log(e);
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	async writeOneOption(instance, metaProperty, value, order, em){
		try{
			const option = await this.optionsPropertyValuesService.findByValue(value);
			if(option===null || option.property.id!==metaProperty.property.id){
				throw new Error(`Option ${value} not found`);
			}
			await em.upsert(this.entityName, {
				instance: instance,
				property: metaProperty.property.id,
				order: order,
				value: option.value,
			});
		}catch(e){
			console.log(e);
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	
	async delete(apiKey: ApiKeys, catalog: number, instance: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.valuesService.transactional(async (em) => {
			this.validateInstance(catalog, instance, em);
			const metaProperty = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, this.metatype);
			if(metaProperty===null){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);			
			}
			await wrap(metaProperty.property).init();
			await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, metaProperty.property.id, 0, !metaProperty.property.options, em);
		});	
	}
	
}