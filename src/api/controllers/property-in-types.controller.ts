import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreatePropertyInTypeDto } from './../dtos/create-property-in-type.dto'
import { UpdatePropertyInTypeDto } from './../dtos/update-property-in-type.dto'
import { PropertyInTypesService } from './../services/property-in-types.service'
import { GenPropertyInTypesController } from './gen/property-in-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'

export class PropertyInTypesController extends GenPropertyInTypesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех свойств товара, с учетом унаследованных от родительских типов, доступных в типе товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		type = await this.processInputType(catalog, type);
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.findEveryByType(type);
	}
	
	@Get('own')
	@ApiOperation({summary: "Получение всех свойств товара прикрепленных к данному типу товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	async findOwn(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		type = await this.processInputType(catalog, type);
		const typeIns = await this.catalogTypesService.findById(type);
		if(typeIns===null || !(typeIns.catalog.id===catalog)){
			throw new HttpException('Product type not found', HttpStatus.NOT_FOUND);
		}
		return await this.propertyInTypesService.findOwnByType(type);
	}
	
	@Get(':property')
	@ApiOperation({summary: "Получение параметров прикрепленния определенного свойства к данному типу товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		type = await this.processInputType(catalog, type);
		return await super.findOne(actor, catalog, type, property);
	}
	
	@Patch(':property')
	@ApiOperation({summary: "Прикрепление свойства к данному типу товара или обновление его параметров"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number, @Body() updateDto: UpdatePropertyInTypeDto) {
		type = await this.processInputType(catalog, type);
		return await super.update(actor, catalog, type, property, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, type: number, property: number, updateDto: UpdatePropertyInTypeDto, em: EntityManager) {
		const propertyInType = await this.propertyInTypesService.getParentsPropertyByChild(property, type, em);
		if(propertyInType!==null){
			throw new HttpException('Parent type already contains this property', HttpStatus.CONFLICT);
		}
		const childs = await this.propertyInTypesService.getChildsWithPropertyByType(property, type, em);
		if(childs.length>0){
			childs.forEach(async (p) => await this.propertyInTypesService.remove(p, em));
		}
		try{
			const propertyIns = await this.catalogPropertiesService.findById(property);
			updateDto.scheme = await this.propertyTypesService.tunePropertyScheme(actor.company.id, propertyIns.scheme, updateDto.scheme, false);
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
	}
	
	@Delete(':property')
	@ApiOperation({summary: "Удаление свойства из данного типа товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'type', description: 'ID типа товара'})
	@ApiParam({name: 'property', description: 'ID свойства'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('type', ParseIntPipe) type: number, @Param('property', ParseIntPipe) property: number) {
		type = await this.processInputType(catalog, type);
		return await super.delete(actor, catalog, type, property);
	}
	
	async processInputType(catalog: number, type: number, em: EntityManager = null){
		if(type===0){
			return (await this.catalogTypesService.findRoot(catalog, em)).id;
		}else{
			return type;
		}
	}
	
}