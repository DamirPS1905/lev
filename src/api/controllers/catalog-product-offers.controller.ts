import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogProductOfferDto } from './../dtos/create-catalog-product-offer.dto'
import { UpdateCatalogProductOfferDto } from './../dtos/update-catalog-product-offer.dto'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service'
import { GenCatalogProductOffersController } from './gen/catalog-product-offers.controller'
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class CatalogProductOffersController extends GenCatalogProductOffersController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка товарных предложений товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, catalog, product, offset, limit);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.findOne(actor, catalog, product, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Body() createDto: CreateCatalogProductOfferDto) {
		return await super.create(actor, catalog, product, createDto);
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление инормации об определенном товарном предложении товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint, @Body() updateDto: UpdateCatalogProductOfferDto) {
		return await super.update(actor, catalog, product, id, updateDto);
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление определенного товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.delete(actor, catalog, product, id);
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, product: bigint, id: bigint, em: EntityManager) {
		await wrap(entity.product).init();
		if(entity.product.offersCount<2){
			throw new HttpException('This is the only product offer', HttpStatus.CONFLICT);
		}
	}
}