import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateProductPriceDto } from './../dtos/create-product-price.dto'
import { UpdateProductPriceDto } from './../dtos/update-product-price.dto'
import { ProductPricesService } from './../services/product-prices.service'
import { GenProductPricesController } from './gen/product-prices.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class ProductPricesController extends GenProductPricesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех цен товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint) {
		return await super.findAll(actor, catalog, product);
	}
	
	@Get(':priceType')
	@ApiOperation({summary: "Получение цены товара определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.findOne(actor, catalog, product, priceType);
	}
	
	@Patch(':priceType')
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
	}
	
	@Delete(':priceType')
	@ApiOperation({summary: "Удаление цены товара определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'priceType', description: 'ID типа цены'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('priceType', ParseIntPipe) priceType: number) {
		return await super.delete(actor, catalog, product, priceType);
	}
	
	
}