import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogTypeDto } from './../dtos/create-catalog-type.dto'
import { UpdateCatalogTypeDto } from './../dtos/update-catalog-type.dto'
import { CatalogTypesService } from './../services/catalog-types.service'
import { GenCatalogTypesController } from './gen/catalog-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, HttpException, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'
import { FsPatch } from './../services/special/files.service';
import { InstanceTypesEnum } from './../enums/instance-types.enum'

export class CatalogTypesController extends GenCatalogTypesController {
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного типа товаров"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа товара (для корневого типа можно использовать 0)'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, catalog, await this.processInputType(catalog, id));
	}
	
	@Get(':id/tree')
	@ApiOperation({summary: "Получение определенного типа товаров с деревом его подтипов"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа товара (для корневого типа можно использовать 0)'})
	async getTree(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const one = await super.findOne(actor, catalog, await this.processInputType(catalog, id));
		return await this.catalogTypesService.readTree(one);
	}
	
	@Post()
	@ApiOperation({summary: "Создание типа товаров"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogTypeDto) {
		createDto.parent = await this.processInputType(catalog, createDto.parent);
		return await super.create(actor, catalog, createDto);
	}
	
	async validateCreate(actor: Actors, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager, fm: FsPatch) {
	  const parentType = await this.catalogTypesService.findById(createDto.parent);
	  if(parentType===null || parentType.catalog.id!==catalog){
			throw new HttpException("Parent type not found", HttpStatus.NOT_FOUND);
	  }
	 	createDto.level = parentType.level + 1;
	}
	
	async afterCreate(entity, actor: Actors, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upVersion(actor.company.id, catalog, InstanceTypesEnum.Type, entity.id, em);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление определенного типа товаров"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа товара (для корневого типа можно использовать 0)'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogTypeDto) {
		updateDto.parent = await this.processInputType(catalog, updateDto.parent);
		return await super.update(actor, catalog, id, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager, fm: FsPatch){
		let parent = updateDto.parent;
	  if(parent!==undefined && entity.parent.id!==parent){
		  const parentType = await this.catalogTypesService.findById(parent);
		  if(parentType===null || parentType.catalog.id!==catalog){
				throw new HttpException("Parent type not found", HttpStatus.NOT_FOUND);
		  }
		  if(await this.catalogTypesOverloadService.findByChildAndParent(parentType.id, entity.id, em)){
				throw new HttpException("New parent type is child of current type", HttpStatus.CONFLICT);			
		  }
		 	updateDto.level = parentType.level + 1;
	 		const prepeared = await this.propertyInTypesService.prepearTypeTransfer(entity.id, entity.parent.id, parent, em);
	 		await this.propertyInTypesService.applyTypeTranser(entity.id, prepeared, em);
	  }
	}
	
	async afterUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager, fm: FsPatch){
		await this.instanceVersionsService.upVersion(actor.company.id, catalog, InstanceTypesEnum.Type, entity.id, em);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Уадление определенного типа товаров"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа товара (корневой тип удалить нельзя)'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, catalog, id);
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager) {
		if(entity.root){
			throw new HttpException("Unable to remove catalog root type", HttpStatus.NOT_FOUND);
		}
	}
	
	async afterDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager) {
		await this.instanceVersionsService.upDeleted(actor.company.id, catalog, InstanceTypesEnum.Type, entity.id, em);
	}
	
	async processInputType(catalog: number, type: number, em: EntityManager = null){
		if(type===0){
			return (await this.catalogTypesService.findRoot(catalog, em)).id;
		}else{
			return type;
		}
	}

	
}