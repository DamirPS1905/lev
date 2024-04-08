import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogMetatypePropertyDto } from './../dtos/create-catalog-metatype-property.dto'
import { UpdateCatalogMetatypePropertyDto } from './../dtos/update-catalog-metatype-property.dto'
import { CatalogMetatypePropertiesService } from './../services/catalog-metatype-properties.service'
import { GenCatalogMetatypePropertiesController } from './gen/catalog-metatype-properties.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogMetatypePropertiesController extends GenCatalogMetatypePropertiesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('metatype', ParseIntPipe) metatype: number, @Param('catalog', ParseIntPipe) catalog: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.CONFLICT);
		}
		return await this.catalogMetatypePropertiesService.findAllByCatalogAndMetatype(catalog, metatype);
	}
	
	@Get('property/:property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number) {
		return await super.findOne(apiKey, catalog, property, metatype);
	}
	
	@Patch('property/:property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number, @Body() updateDto: UpdateCatalogMetatypePropertyDto) {
		return await super.update(apiKey, catalog, property, metatype, updateDto);
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, property: number, metatype: number, updateDto: UpdateCatalogMetatypePropertyDto, em: EntityManager) {
		try{
			const propertyIns = await this.catalogPropertiesService.findById(property);
			updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(apiKey.company.id, propertyIns.scheme, updateDto.scheme, true);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Delete('property/:property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('property', ParseIntPipe) property: number, @Param('metatype', ParseIntPipe) metatype: number) {
		return await super.delete(apiKey, catalog, property, metatype);
	}
	
	
}