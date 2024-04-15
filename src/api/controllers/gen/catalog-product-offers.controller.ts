/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalog-product-offers.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { ApiKeys } from './../../../entities/ApiKeys';
import { CreateCatalogProductOfferDto } from './../../dtos/create-catalog-product-offer.dto';
import { UpdateCatalogProductOfferDto } from './../../dtos/update-catalog-product-offer.dto';
import { CatalogProductOffersService } from './../../services/catalog-product-offers.service';
import { CatalogProductsService } from './../../services/catalog-products.service';
import { CatalogsService } from './../../services/catalogs.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog product offers')
@Controller('catalog/:catalog/product/:product/offer')
export class GenCatalogProductOffersController {
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys, catalog: number, product: bigint, offset: number, limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.catalogProductOffersService.listByCatalog(catalog, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		const entity = await this.catalogProductOffersService.findById(id);
		if(entity===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, catalog, product, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) { }
	
	async create(apiKey: ApiKeys, catalog: number, product: bigint, createDto: CreateCatalogProductOfferDto) {
		createDto.product = product;
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const existed0 = await this.catalogProductOffersService.findByCatalogAndArticle(catalog, createDto.article, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, article)', HttpStatus.CONFLICT);
			}
			const tmp = await this.catalogProductsService.findById(product, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (product)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, catalog, product, createDto, em);
			return await this.catalogProductOffersService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, catalog: number, product: bigint, createDto: CreateCatalogProductOfferDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, updateDto: UpdateCatalogProductOfferDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			const tmp = await this.catalogProductsService.findById(product, em);
			if(tmp===null){
				throw new HttpException('Not found contrainst (product)', HttpStatus.CONFLICT);
			}
			if(entity===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.article!==undefined && updateDto.article!==entity.article)){
				const existed = await this.catalogProductOffersService.findByCatalogAndArticle(entity.catalog.id, updateDto.article, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, article)', HttpStatus.CONFLICT);
				}
			}
			await this.validateUpdate(entity, apiKey, catalog, product, id, updateDto, em);
			return await this.catalogProductOffersService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, updateDto: UpdateCatalogProductOfferDto, em: EntityManager) { }
	
	async delete(apiKey: ApiKeys, catalog: number, product: bigint, id: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===apiKey.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductOffersService.transactional(async (em) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			if(entity===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, catalog, product, id, em);
			return await this.catalogProductOffersService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, catalog: number, product: bigint, id: bigint, em: EntityManager) { }
	
}