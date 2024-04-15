import { Actors } from './../../../entities/Actors'
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


@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
export abstract class AbstractValuesController<P, S extends IMetatypeVauesService<P>> {
		
	constructor(
		protected readonly entityName:string,
		protected readonly catalogsService: CatalogsService,
		protected readonly optionsPropertyValuesService: OptionsPropertyValuesService,
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly valuesService: S,
	) { }
		
	async findAll(actor: Actors, catalog: number, instance: P) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		await this.validateInstance(catalog, instance, null);
		let tmp = null, prop = null, propType = null, mul = null;
		const result = [],
					raw = (await this.valuesService.readValuesByInstance(instance));
		console.log(raw);
		for(let p of raw){
			if(prop!==p.property){
				if(tmp!==null){
					result.push({
						property: prop,
						value: await this.propertyTypesService.short(propType, mul? tmp: tmp[0])
					});
				}
				tmp = [p.value];
				prop = p.property;
				mul = p.multiple;
				propType = p.type;
			}else{
				tmp.push(p.value);
			}
		}
		if(tmp!==null){
			result.push({
				property: prop,
				value: await this.propertyTypesService.short(propType, mul? tmp: tmp[0])
			});
		}
		return result;
	}
	
	async findOne(actor: Actors, catalog: number, instance: P, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		await this.validateInstance(catalog, instance, null);
		const [propertyIns, scheme] = await this.validateAttachment(catalog, property, instance, null);
		if(propertyIns.multiple){
			return await this.propertyTypesService.short(propertyIns.type.id, (await this.valuesService.readValuesByInstanceAndProperty(instance, property))
				.map(p => p.value));
		}else{
			const val = await this.valuesService.readValueByInstanceAndProperty(instance, property);
			if(val!==null) return await this.propertyTypesService.short(propertyIns.type.id, val.value);
			else{
				throw new HttpException('Proprty value not setted', HttpStatus.NOT_FOUND);
			}
		}
	}
	
	protected abstract validateInstance(catalog:number, instance: P, em: EntityManager);
	
	protected abstract validateAttachment(catalog: number, property: number, instance: P, em: EntityManager);
	
	async update(actor: Actors, catalog: number, instance: P, property: number, updateDto: Object | Array<Object>) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.valuesService.transactional(async (em) => {
			await this.validateInstance(catalog, instance, em);
			const [propertyIns, scheme] = await this.validateAttachment(catalog, property, instance, em);
			if(propertyIns.options){
				if(propertyIns.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOneOption(instance, propertyIns, scheme, updateDto[i], i, em);
						}
						await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, propertyIns.id, updateDto.length, false, em);
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOneOption(instance, propertyIns, scheme, updateDto, 0, em);
				}
			}else{
				if(propertyIns.multiple){
					if(updateDto instanceof Array){
						for(let i = 0; i<updateDto.length; i++){
							await this.writeOne(actor.company.id, instance, propertyIns, scheme, updateDto[i], i, em);
						}
						await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, propertyIns.id, updateDto.length, true, em);
					}else{
						throw new HttpException('You should provide array for multiple properties', HttpStatus.CONFLICT);
					}
				}else{
					await this.writeOne(actor.company.id, instance, propertyIns, scheme, updateDto, 0, em);
				}
			}
		});
	}
	
	async writeOne(company, instance, propertyIns, scheme, value, order, em){
		try{
			const entity = await this.valuesService.findByInstanceAndPropertyAndOrder(instance, propertyIns.id, order, em);
			let valKey = entity===null? null: entity.value;
			const val = await this.propertyTypesService.validateSingleValue(company, scheme, value);
			if(valKey===null){
				const conn = em.getConnection();
				valKey = (await conn.execute(`SELECT nextval('property_value_id')::int8 as res`))[0].res;
			}
			await em.upsert(PropertyValues, {
				valueKey: valKey,
				type: propertyIns.type.id,
				value: val
			});
			if(entity===null){
				await em.upsert(this.entityName, {
					instance: instance,
					property: propertyIns.id,
					order: order,
					value: valKey,
				});
			}
		}catch(e){
			console.log(e);
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	async writeOneOption(instance, propertyIns, scheme, value, order, em){
		try{
			const option = await this.optionsPropertyValuesService.findByValue(value.option);
			if(option===null || option.property.id!==propertyIns.id){
				throw new Error(`Option ${value} not found`);
			}
			await em.upsert(this.entityName, {
				instance: instance,
				property: propertyIns.id,
				order: order,
				value: option.value,
			});
		}catch(e){
			console.log(e);
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	async delete(actor: Actors, catalog: number, instance: P, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.valuesService.transactional(async (em) => {
			await this.validateInstance(catalog, instance, em);
			const [propertyIns, scheme] = await this.validateAttachment(catalog, property, instance, em);
			await this.valuesService.removeExtraByInstanceAndPropertyAndMaxOrder(instance, propertyIns.id, 0, !propertyIns.options, em);
		});	
	}
	
}