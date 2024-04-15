/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/property-in-types.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreatePropertyInTypeDto } from './../../dtos/create-property-in-type.dto';
import { UpdatePropertyInTypeDto } from './../../dtos/update-property-in-type.dto';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogTypesOverloadService } from './../../services/catalog-types-overload.service';
import { CatalogTypesService } from './../../services/catalog-types.service';
import { CatalogsService } from './../../services/catalogs.service';
import { PropertyInTypesService } from './../../services/property-in-types.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Property in types')
@Controller('catalog/:catalog/in-type/:type/property')
export class GenPropertyInTypesController {
	constructor(
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogTypesOverloadService: CatalogTypesOverloadService,
		protected readonly catalogTypesService: CatalogTypesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly propertyInTypesService: PropertyInTypesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findOne(actor: Actors, catalog: number, type: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property);
		if(entity===null || !(entity.type.id===type)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, type, property);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, type: number, property: number) { }
	
	async update(actor: Actors, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto) {
		updateDto.type = type;
		updateDto.property = property;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.transactional(async (em) => {
			const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
			}
			const typeIns = await this.catalogTypesService.findById(type);
			if(typeIns===null || !(typeIns.catalog.id===catalog)){
				throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, catalog, type, property, updateDto, em);
			if(entity!==null){
				if(!(entity.type.id===type)){
					throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
				}
				return await this.propertyInTypesService.update(entity, updateDto, em);
			} else {
				return await this.propertyInTypesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto, em: EntityManager) { }
	
	async delete(actor: Actors, catalog: number, type: number, property: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.transactional(async (em) => {
			const entity = await this.propertyInTypesService.findByTypeAndProperty(type, property, em);
			if(entity===null || !(entity.type.id===type)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, type, property, em);
			return await this.propertyInTypesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, type: number, property: number, em: EntityManager) { }
	
}