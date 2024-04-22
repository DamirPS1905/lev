import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateProductPriceDto } from './../dtos/create-product-price.dto'
import { UpdateProductPriceDto } from './../dtos/update-product-price.dto'
import { ProductPricesService } from './../services/product-prices.service'
import { GenProductPricesController } from './gen/product-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, DefaultValuePipe, ParseEnumPipe, UseGuards, Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'
import { refill } from './../../util/utils';

export class ProductPricesController extends GenProductPricesController {
	
	@Get('product/:product/price/all')
	@ApiOperation({summary: "Получение всех цен товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.findActualByProduct(product);
	}
	
	@Get('price/:priceType/products/all')
	@ApiOperation({summary: "Получение цен определенного типа товаров в каталоге"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAllByType(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('priceType', ParseIntPipe) priceType: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const priceTypeIns = await this.priceTypesService.findById(priceType);
		if(priceTypeIns===null || !(priceTypeIns.company.id===actor.company.id)){
			throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.listActualByPriceTypeAndCatalog(priceType, catalog, offset, limit);
	}
	
	@Get('price/:priceType/products/updates-from/:version')
	@ApiOperation({summary: "Получение цен определенного типа товаров в каталоге"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	@ApiParam({name: 'version', description: 'Последняя версия цен товаров полученная от апи'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	async findNewByType(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('priceType', ParseIntPipe) priceType: number, @Param('version', ParseBigIntPipe) version: bigint, @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const priceTypeIns = await this.priceTypesService.findById(priceType);
		if(priceTypeIns===null || !(priceTypeIns.company.id===actor.company.id)){
			throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
		}
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		return await this.productPricesService.findNewByPriceTypeAndCatalog(priceType, catalog, version, limit);
	}
	
	@Get('product/:product/price/:priceType')
	@ApiOperation({summary: "Получение цены товара определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(actor, catalog, product, priceType);
	}
	
	async validateRead(entity, actor: Actors, catalog: number, product: bigint, priceType: number){
		if(entity.deleted){
			throw new HttpException('Product price not found', HttpStatus.NOT_FOUND);
		}
	}
		
	@Patch('product/:product/price/:priceType')
	@ApiOperation({summary: "Задание или обновлене цены товара определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('priceType', ParseIntPipe) priceType: number, @Body() updateDto: UpdateProductPriceDto) {
		return await super.update(actor, catalog, product, priceType, updateDto);
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto, em: EntityManager) {
		try{
			const priceTypeIns = await this.priceTypesService.findById(priceType, em);
			if(updateDto.currency===undefined || updateDto.currency===priceTypeIns.baseCurrency.id){
				updateDto.index = updateDto.value;
			}else{
				updateDto.index = (parseFloat(updateDto.value)*(await this.ratesService.getRate(updateDto.currency, priceTypeIns.baseCurrency.id))).toFixed(2);
			}
			updateDto.updatedAt = new Date();
		}catch(e){
			throw new HttpException(e.message, HttpStatus.CONFLICT);
		}
		updateDto.deleted = false;
	}
	
	@Delete('product/:product/price/:priceType')
	@ApiOperation({summary: "Удаление цены товара определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.transactional(async (em, fm) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			if(entity===null || entity.deleted){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.productPricesService.update(entity, refill(UpdateProductPriceDto, {deleted: true}), em);
		});
	}
	
	
}