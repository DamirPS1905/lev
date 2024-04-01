/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-product-offers.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogProductOfferDto } from './../../dtos/create-catalog-product-offer.dto'
import { UpdateCatalogProductOfferDto } from './../../dtos/update-catalog-product-offer.dto'
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service'
import { CatalogProductsService } from './../../services/catalog-products.service'
import { CatalogsService } from './../../services/catalogs.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog product offers')
@Controller('catalog/:catalog/product/:product/offer')
export class GenCatalogProductOffersController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, offset: number, limit: number, catalog: number, product: bigint) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogProductOffersService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogProductOffersService.findById(id);
		if(entity===null || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, product, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) { }
	
	async create(apiKey: ApiKeys, catalog: number, product: bigint, createDto: CreateCatalogProductOfferDto) {
		createDto.product = product;
		createDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const existed0 = await this.catalogProductOffersService.findByCatalogAndArticle(createDto.catalog, createDto.article, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, article)', HttpStatus.CONFLICT);
			}
			const tmp2 = await this.catalogProductsService.findById(createDto.product, em);
			if(tmp2===null){
				throw new HttpException('Not found contrainst (product)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, product, createDto, em);
			return await this.catalogProductOffersService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, product: bigint, createDto: CreateCatalogProductOfferDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, updateDto: UpdateCatalogProductOfferDto) {
		updateDto.product = product;
		updateDto.catalog = catalog;
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			const tmp2 = await this.catalogProductsService.findById(updateDto.product, em);
			if(tmp2===null){
				throw new HttpException('Not found contrainst (product)', HttpStatus.CONFLICT);
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.catalog!==undefined && updateDto.catalog!==entity.catalog.id) || (updateDto.article!==undefined && updateDto.article!==entity.article)){
				const existed0 = await this.catalogProductOffersService.findByCatalogAndArticle(updateDto.catalog, updateDto.article, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (catalog, article)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, catalog, product, id, updateDto);
			return await this.catalogProductOffersService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, updateDto: UpdateCatalogProductOfferDto) { }
	
	async delete(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) {
		const catalogIns0 = await this.catalogsService.findById(catalog);
		if(catalogIns0===null || !(catalogIns0.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns1 = await this.catalogProductsService.findById(product);
		if(productIns1===null || !(productIns1.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, product, id, em);
			return await this.catalogProductOffersService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, em: EntityManager) { }
	
}