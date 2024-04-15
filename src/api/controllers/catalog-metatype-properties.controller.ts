import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogMetatypePropertyDto } from './../dtos/create-catalog-metatype-property.dto'
import { UpdateCatalogMetatypePropertyDto } from './../dtos/update-catalog-metatype-property.dto'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { GenCatalogMetatypePropertiesController } from './gen/catalog-metatype-properties.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogMetatypePropertiesController extends GenCatalogMetatypePropertiesController {
	
	@Get('all')
	async findAll(@AuthInfo() actor: Actors, @Param('metatype', ParseIntPipe) metatype: number, @Param('catalog', ParseIntPipe) catalog: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.CONFLICT);
		}
		return await this.catalogMetatypePropertiesService.findAllByCatalogAndMetatype(catalog, metatype);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number) {
		return await super.findOne(actor, catalog, property, metatype);
	}
	
	@Patch('property/:property')
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number, @Body() updateDto: UpdateCatalogMetatypePropertyDto) {
		return await super.update(actor, catalog, property, metatype, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto, em: EntityManager) {
		try{
			const propertyIns = await this.catalogPropertiesService.findById(property);
			updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(actor.company.id, propertyIns.scheme, updateDto.scheme, false);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Delete('property/:property')
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number) {
		return await super.delete(actor, catalog, property, metatype);
	}
	
	
}