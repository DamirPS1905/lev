/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-metatype-properties.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateCatalogMetatypePropertyDto } from './../../dtos/create-catalog-metatype-property.dto';
import { UpdateCatalogMetatypePropertyDto } from './../../dtos/update-catalog-metatype-property.dto';
import { CatalogMetatypePropertiesService } from './../../services/catalog-metatype-properties.service';
import { CatalogPropertiesService } from './../../services/catalog-properties.service';
import { CatalogsService } from './../../services/catalogs.service';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { MetatypesService } from './../../services/metatypes.service';
import { PropertyTypesService } from './../../services/property-types.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog metatype properties')
@Controller('catalog/:catalog/metatype/:metatype')
export class GenCatalogMetatypePropertiesController {
	constructor(
		protected readonly catalogMetatypePropertiesService: CatalogMetatypePropertiesService,
		protected readonly catalogPropertiesService: CatalogPropertiesService,
		protected readonly catalogsService: CatalogsService,
		protected readonly instanceVersionsService: InstanceVersionsService,
		protected readonly metatypesService: MetatypesService,
		protected readonly propertyTypesService: PropertyTypesService,
	) { }
	
	async findOne(actor: Actors, catalog: number, property: number, metatype: number) {
		const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, property, metatype);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, property: number, metatype: number) { }
	
	async update(actor: Actors, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto) {
		updateDto.metatype = metatype;
		updateDto.catalog = catalog;
		updateDto.property = property;
		return await this.catalogMetatypePropertiesService.transactional(async (em, fm) => {
			const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype, em);
			const propertyIns = await this.catalogPropertiesService.findById(property);
			if(propertyIns===null || !(propertyIns.catalog.id===catalog)){
				throw new HttpException('Property not found', HttpStatus.CONFLICT);
			}
			const metatypeIns = await this.metatypesService.findById(metatype);
			if(metatypeIns===null){
				throw new HttpException('Metatype not found', HttpStatus.CONFLICT);
			}
			const catalogIns = await this.catalogsService.findById(catalog);
			if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
				throw new HttpException('Catalog not found', HttpStatus.CONFLICT);
			}
			await this.validateUpdate(entity, actor, catalog, property, metatype, updateDto, em, fm);
			if(entity!==null){
				const result = await this.catalogMetatypePropertiesService.update(entity, updateDto, em);
				await this.afterUpdate(entity, actor, catalog, property, metatype, updateDto, em, fm);
				return result;
			} else {
				const result = await this.catalogMetatypePropertiesService.create(updateDto, em);
				await this.afterUpdate(entity, actor, catalog, property, metatype, updateDto, em, fm);
				return result;
			}
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, property: number, metatype: number) {
		return await this.catalogMetatypePropertiesService.transactional(async (em, fm) => {
			const entity = await this.catalogMetatypePropertiesService.findByCatalogAndPropertyAndMetatype(catalog, property, metatype, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, property, metatype, em, fm);
			await this.catalogMetatypePropertiesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, property, metatype, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, property: number, metatype: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, property: number, metatype: number, em: EntityManager, fm: FsPatch) { }
	
}