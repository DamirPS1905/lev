import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateProductRelationDto } from './../dtos/create-product-relation.dto';
import { UpdateProductRelationDto } from './../dtos/update-product-relation.dto';
import { InstanceTypesEnum } from './../enums/instance-types.enum';
import { ProductsRelationKindsEnum } from './../enums/products-relation-kinds.enum';
import { ProductRelationsService } from './../services/product-relations.service';
import { FsPatch } from './../services/special/files.service';
import { GenProductRelationsController } from './gen/product-relations.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

export class ProductRelationsController extends GenProductRelationsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка типов существующих взаимоотношений товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(actor, catalog);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение иноформации о существующем типе взаимоотношений товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа взаимоотношениия'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.findOne(actor, catalog, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание нового типа взаимоотношений товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateProductRelationDto) {
		createDto.symmetric = createDto.symmetric && (createDto.kind===ProductsRelationKindsEnum.ProductToProduct || createDto.kind===ProductsRelationKindsEnum.OfferToOffer);
		return await super.create(actor, catalog, createDto);
	}
	
	async afterCreate(entity, actor: Actors, catalog: number, createDto: CreateProductRelationDto, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upVersion(actor.company.id, catalog, InstanceTypesEnum.Relation, entity.id, em);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление иноформации о существующем типе взаимоотношений товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа взаимоотношениия'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateProductRelationDto) {
		updateDto.symmetric = updateDto.symmetric && (updateDto.kind===ProductsRelationKindsEnum.ProductToProduct || updateDto.kind===ProductsRelationKindsEnum.OfferToOffer);
		return await super.update(actor, catalog, id, updateDto);
	}
	
	async afterUpdate(entity, actor: Actors, catalog: number, id: number, updateDto: UpdateProductRelationDto, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upVersion(actor.company.id, catalog, InstanceTypesEnum.Relation, entity.id, em);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление существующего типа взаимоотношений товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа взаимоотношениия'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		return await super.delete(actor, catalog, id);
	}
	
	async afterDelete(entity, actor: Actors, catalog: number, id: number, em: EntityManager, fm: FsPatch) {
		await this.instanceVersionsService.upDeleted(actor.company.id, catalog, InstanceTypesEnum.Relation, entity.id, em);
	}
	
	
}