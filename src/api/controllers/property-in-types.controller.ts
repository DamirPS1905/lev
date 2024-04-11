import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePropertyInTypeDto } from './../dtos/create-property-in-type.dto'
import { UpdatePropertyInTypeDto } from './../dtos/update-property-in-type.dto'
import { PropertyInTypesService } from './../services/property-in-types.service'
import { GenPropertyInTypesController } from './gen/property-in-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery } from '@nestjs/swagger'

export class PropertyInTypesController extends GenPropertyInTypesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.findEveryByType(type);
	}
	
	@Get('own')
	async findOwn(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.findOwnByType(type);
	}
	
	@Get(':property')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.findOne(apiKey, catalog, type, property);
	}
	
	@Patch(':property')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdatePropertyInTypeDto) {
		return await super.update(apiKey, catalog, type, property, updateDto);
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto, em: EntityManager) {
		const parents = await this.propertyInTypesService.getParentsWithPropertyByType(property, type, em);
		if(parents.length>0){
			throw new HttpException('Parent type already contains this property', HttpStatus.CONFLICT);
		}
		const childs = await this.propertyInTypesService.getChildsWithPropertyByType(property, type, em);
		if(childs.length>0){
			childs.forEach(async (p) => await this.propertyInTypesService.remove(p, em));
		}
		try{
			const propertyIns = await this.catalogPropertiesService.findById(property);
			updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(apiKey.company.id, propertyIns.scheme, updateDto.scheme, false);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Delete(':property')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		return await super.delete(apiKey, catalog, type, property);
	}
	
}