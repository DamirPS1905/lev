import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogTypeDto } from './../dtos/create-catalog-type.dto'
import { UpdateCatalogTypeDto } from './../dtos/update-catalog-type.dto'
import { CatalogTypesService } from './../services/catalog-types.service'
import { GenCatalogTypesController } from './gen/catalog-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post, HttpException, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogTypesController extends GenCatalogTypesController {
	
	@Get(':id')
	async findOne(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(apiKey, catalog, await this.processInputType(catalog, id));
	}
	
	@Get(':id/tree')
	async getTree(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const one = await super.findOne(apiKey, catalog, await this.processInputType(catalog, id));
		return await this.catalogTypesService.readTree(one);
	}
	
	@Post()
	async create(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateCatalogTypeDto) {
		createDto.parent = await this.processInputType(catalog, createDto.parent);
		return await super.create(apiKey, catalog, createDto);
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, createDto: CreateCatalogTypeDto, em: EntityManager) {
	  const parentType = await this.catalogTypesService.findById(createDto.parent);
	  if(parentType===null || parentType.catalog.id!==catalog){
			throw new HttpException("Parent type not found", HttpStatus.NOT_FOUND);
	  }
	 	createDto.level = parentType.level + 1;
	}
	
	@Patch(':id')
	async update(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCatalogTypeDto) {
		updateDto.parent = await this.processInputType(catalog, updateDto.parent);
		return await super.update(apiKey, catalog, id, updateDto);
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager) {
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
	
	@Delete(':id')
	async delete(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(apiKey, catalog, id);
	}
	
	async processInputType(catalog: number, parent: number, em: EntityManager = null){
		if(parent===0){
			return (await this.catalogTypesService.findRoot(catalog, em)).id;
		}else{
			return parent;
		}
	}

	
}