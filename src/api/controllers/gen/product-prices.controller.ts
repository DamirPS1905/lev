/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/product-prices.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateProductPriceDto } from './../../dtos/create-product-price.dto';
import { UpdateProductPriceDto } from './../../dtos/update-product-price.dto';
import { CatalogProductsService } from './../../services/catalog-products.service';
import { CatalogsService } from './../../services/catalogs.service';
import { InstanceVersionsService } from './../../services/instance-versions.service';
import { PriceTypesService } from './../../services/price-types.service';
import { ProductPricesService } from './../../services/product-prices.service';
import { RatesService } from './../../services/rates.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product prices')
@Controller('catalog/:catalog/')
export class GenProductPricesController {
	constructor(
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
		protected readonly instanceVersionsService: InstanceVersionsService,
		protected readonly priceTypesService: PriceTypesService,
		protected readonly productPricesService: ProductPricesService,
		protected readonly ratesService: RatesService,
	) { }
	
	async findOne(actor: Actors, catalog: number, product: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.productPricesService.findByProductAndPriceType(product, priceType);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, actor, catalog, product, priceType);
		return entity;
	}
	
	async validateRead(entity, actor: Actors, catalog: number, product: bigint, priceType: number) { }
	
	async update(actor: Actors, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto) {
		updateDto.product = product;
		updateDto.priceType = priceType;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.transactional(async (em, fm) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			const priceTypeIns = await this.priceTypesService.findById(priceType);
			if(priceTypeIns===null || !(priceTypeIns.company.id===actor.company.id)){
				throw new HttpException('Price type not found', HttpStatus.NOT_FOUND);
			}
			const productIns = await this.catalogProductsService.findById(product);
			if(productIns===null || !(productIns.catalog.id===catalog)){
				throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
			}
			await this.validateUpdate(entity, actor, catalog, product, priceType, updateDto, em, fm);
			if(entity!==null){
				const result = await this.productPricesService.update(entity, updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, priceType, updateDto, em, fm);
				return result;
			} else {
				const result = await this.productPricesService.create(updateDto, em);
				await this.afterUpdate(entity, actor, catalog, product, priceType, updateDto, em, fm);
				return result;
			}
		});
	}
	
	async validateUpdate(entity, actor: Actors, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto, em: EntityManager, fm: FsPatch) { }
	async afterUpdate(entity, actor: Actors, catalog: number, product: bigint, priceType: number, updateDto: UpdateProductPriceDto, em: EntityManager, fm: FsPatch) { }
	
	async delete(actor: Actors, catalog: number, product: bigint, priceType: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.productPricesService.transactional(async (em, fm) => {
			const entity = await this.productPricesService.findByProductAndPriceType(product, priceType, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, actor, catalog, product, priceType, em, fm);
			await this.productPricesService.remove(entity, em);
			await this.afterDelete(entity, actor, catalog, product, priceType, em, fm);
		});
	}
	
	async validateDelete(entity, actor: Actors, catalog: number, product: bigint, priceType: number, em: EntityManager, fm: FsPatch) { }
	async afterDelete(entity, actor: Actors, catalog: number, product: bigint, priceType: number, em: EntityManager, fm: FsPatch) { }
	
}