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
import { CatalogsService } from './../../services/catalogs.service'
import { PriceTypesService } from './../../services/price-types.service'
import { ProductPricesService } from './../../services/product-prices.service'
import { RatesService } from './../../services/rates.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product prices')
@Controller('catalog/:catalog/product/:product/price')
export class GenProductPricesController {
	constructor(
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
		protected readonly priceTypesService: PriceTypesService,
		protected readonly productPricesService: ProductPricesService,
		protected readonly ratesService: RatesService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, product: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.findAllByProduct(product);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, product: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productPricesService.findByProductAndPriceType(product, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, product, priceType);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, priceType: number) { }
	
	async update(apiKey: ApiKeys, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto) {
		updateDto.product = product;
		updateDto.priceType = priceType;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.transactional(async (em) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			const priceTypeIns = await this.priceTypesService.findById(priceType);
			if(priceTypeIns===null || !(priceTypeIns.company.id===apiKey.company.id)){
				throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
			}
			const productIns = await this.catalogProductsService.findById(product);
			if(productIns===null || !(productIns.catalog.id===catalog)){
				throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, apiKey, catalog, product, priceType, updateDto, em);
			if(entity!==null){
				return await this.productPricesService.update(entity, updateDto, em);
			} else {
				return await this.productPricesService.create(updateDto, em);
			}
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, product: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.transactional(async (em) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, product, priceType, em);
			return await this.productPricesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, priceType: number, em: EntityManager) { }
	
}