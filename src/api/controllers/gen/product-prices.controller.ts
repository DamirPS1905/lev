/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/product-prices.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateProductPriceDto } from './../../dtos/create-product-price.dto'
import { UpdateProductPriceDto } from './../../dtos/update-product-price.dto'
import { CatalogProductsService } from './../../services/catalog-products.service'
import { PriceTypesService } from './../../services/price-types.service'
import { ProductPricesService } from './../../services/product-prices.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product prices')
@Controller('catalog/:catalog/product-price')
export class GenProductPricesController {
	constructor(
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly priceTypesService: PriceTypesService,
		protected readonly productPricesService: ProductPricesService,
	) { }
	
	async findAll(apiKey: ApiKeys, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000; // throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		return await this.productPricesService.listAll(offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, product: bigint, priceType: number) {
		const entity = await this.productPricesService.findByProductAndPriceType(product, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, product, priceType);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, product: bigint, priceType: number) { }
	
	async update(apiKey: ApiKeys, product: bigint, priceType: number, updateDto: UpdateProductPriceDto) {
		return await this.productPricesService.transactional(async (em) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			if((updateDto.priceType!==undefined && updateDto.priceType!==entity.priceType.id)){
				const tmp0 = await this.priceTypesService.findById(updateDto.priceType, em);
				if(tmp0===null){
					throw new HttpException('Not found contrainst (priceType)', HttpStatus.CONFLICT);
				}
			}
			if((updateDto.product!==undefined && updateDto.product!==entity.product.id)){
				const tmp1 = await this.catalogProductsService.findById(updateDto.product, em);
				if(tmp1===null){
					throw new HttpException('Not found contrainst (product)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, product, priceType, updateDto, em);
			if(entity===null){
				return await this.productPricesService.update(entity, updateDto, em);
			} else {
				return await this.productPricesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, product: bigint, priceType: number, updateDto: UpdateProductPriceDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, product: bigint, priceType: number) {
		return await this.productPricesService.transactional(async (em) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, product, priceType, em);
			return await this.productPricesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, product: bigint, priceType: number, em: EntityManager) { }
	
}