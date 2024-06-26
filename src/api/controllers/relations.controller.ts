import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe';
import { CreateRelationDto } from './../dtos/create-relation.dto';
import { ProductsRelationKindsEnum } from './../enums/products-relation-kinds.enum';
import { CatalogProductOffersService } from './../services/catalog-product-offers.service';
import { CatalogProductsService } from './../services/catalog-products.service';
import { CatalogsService } from './../services/catalogs.service';
import { OoRelationValuesService } from './../services/oo-relation-values.service';
import { OpRelationValuesService } from './../services/op-relation-values.service';
import { PoRelationValuesService } from './../services/po-relation-values.service';
import { PpRelationValuesService } from './../services/pp-relation-values.service';
import { ProductRelationsService } from './../services/product-relations.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Product and/or offers relations')
@Controller('catalog/:catalog/product-relation/:relation')
export class RelationsController{
	
	constructor(
		protected readonly catalogsService: CatalogsService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly productRelationsService: ProductRelationsService,
		protected readonly ppRelationValuesService: PpRelationValuesService,
		protected readonly poRelationValuesService: PoRelationValuesService,
		protected readonly opRelationValuesService: OpRelationValuesService,
		protected readonly ooRelationValuesService: OoRelationValuesService,
	) { }
	
	@Get('updates-from/:version')
	@ApiOperation({summary: "Получение изменений во взаимоотношениях определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'relation', description: 'ID типа взаимоотношениия'})
	@ApiParam({name: 'version', description: 'Последняя версия взаимоотношений товаров полученная от апи'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	async findNewByRelation(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('relation', ParseIntPipe) relation: number, @Param('version', ParseBigIntPipe) version: bigint, @Query('limit', new DefaultValuePipe(1000), ParseIntPipe) limit: number) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const relationIns = await this.productRelationsService.findById(relation);
		if(relationIns===null || relationIns.catalog.id!==catalog){
			throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
		}
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>5000) limit = 5000;
		switch(relationIns.kind.id){
			case ProductsRelationKindsEnum.ProductToProduct:
				return await this.ppRelationValuesService.findNewByRelation(relation, version, limit);
			case ProductsRelationKindsEnum.ProductToOffer:
				return await this.poRelationValuesService.findNewByRelation(relation, version, limit);
			case ProductsRelationKindsEnum.OfferToProduct:
				return await this.opRelationValuesService.findNewByRelation(relation, version, limit);
			case ProductsRelationKindsEnum.OfferToOffer:
				return await this.ooRelationValuesService.findNewByRelation(relation, version, limit);
		}
	}
	
	@Get(':source/targets')
	@ApiOperation({summary: "Получение списка товаров или товарных предложений находящихся в позиции цели определенного взаимоотношения товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'relation', description: 'ID типа взаимоотношениия'})
	@ApiParam({name: 'source', description: 'ID источника (товара или товарного предложения) во взаимоотношении'})
	async allTargets(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('relation', ParseIntPipe) relation: number, @Param('source', ParseBigIntPipe) source: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==actor.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const relationIns = await this.productRelationsService.findById(relation);
		if(relationIns===null || relationIns.catalog.id!==catalog){
			throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case ProductsRelationKindsEnum.ProductToProduct:
				return await this.ppRelationValuesService.getAllTargets(relation, source);
			case ProductsRelationKindsEnum.ProductToOffer:
				return await this.poRelationValuesService.getAllTargets(relation, source);
			case ProductsRelationKindsEnum.OfferToProduct:
				return await this.opRelationValuesService.getAllTargets(relation, source);
			case ProductsRelationKindsEnum.OfferToOffer:
				return await this.ooRelationValuesService.getAllTargets(relation, source);
		}
	}
	
	@Get(':target/sources')
	@ApiOperation({summary: "Получение списка товаров или товарных предложений находящихся в позиции цели определенного взаимоотношения товаров и/или товарных предложений"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'relation', description: 'ID типа взаимоотношениия'})
	@ApiParam({name: 'target', description: 'ID цели (товара или товарного предложения) во взаимоотношении'})
	async allSources(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('relation', ParseIntPipe) relation: number, @Param('target', ParseBigIntPipe) target: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==actor.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const relationIns = await this.productRelationsService.findById(relation);
		if(relationIns===null || relationIns.catalog.id!==catalog){
			throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case ProductsRelationKindsEnum.ProductToProduct:
				return await this.ppRelationValuesService.getAllSources(relation, target);				break;
			case ProductsRelationKindsEnum.ProductToOffer:
				return await this.poRelationValuesService.getAllSources(relation, target);
			case ProductsRelationKindsEnum.OfferToProduct:
				return await this.opRelationValuesService.getAllSources(relation, target);
			case ProductsRelationKindsEnum.OfferToOffer:
				return await this.ooRelationValuesService.getAllSources(relation, target);
		}
	}
	
	@Post(':source/to/:target')
	@ApiOperation({summary: "Создание определеннго взаимоотношения между товарами и/или товарными предложениями"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'relation', description: 'ID типа взаимоотношениия'})
	@ApiParam({name: 'source', description: 'ID источника (товара или товарного предложения) во взаимоотношении'})
	@ApiParam({name: 'target', description: 'ID цели (товара или товарного предложения) во взаимоотношении'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('relation', ParseIntPipe) relation: number, @Param('source', ParseBigIntPipe) source: bigint, @Param('target', ParseBigIntPipe) target: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==actor.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const relationIns = await this.productRelationsService.findById(relation);
		if(relationIns===null || relationIns.catalog.id!==catalog){
			throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case ProductsRelationKindsEnum.ProductToProduct:
			case ProductsRelationKindsEnum.ProductToOffer:
				const productIns = await this.catalogProductsService.findById(source);
				if(productIns===null || productIns.catalog.id!==catalog){
					throw new HttpException('Source product not found', HttpStatus.NOT_FOUND);
				}
				break;
			case ProductsRelationKindsEnum.OfferToProduct:
			case ProductsRelationKindsEnum.OfferToOffer:
				const offerIns = await this.catalogProductOffersService.findById(source);
				if(offerIns===null || offerIns.catalog.id!==catalog){
					throw new HttpException('Source product offer not found', HttpStatus.NOT_FOUND);
				}
				break;
		}
		switch(relationIns.kind.id){
			case ProductsRelationKindsEnum.ProductToProduct:
			case ProductsRelationKindsEnum.OfferToProduct:
				const productIns = await this.catalogProductsService.findById(target);
				if(productIns===null || productIns.catalog.id!==catalog){
					throw new HttpException('Source product not found', HttpStatus.NOT_FOUND);
				}
				break;
			case ProductsRelationKindsEnum.ProductToOffer:
			case ProductsRelationKindsEnum.OfferToOffer:
				const offerIns = await this.catalogProductOffersService.findById(target);
				if(offerIns===null || offerIns.catalog.id!==catalog){
					throw new HttpException('Source product offer not found', HttpStatus.NOT_FOUND);
				}
				break;
		}
		const base = new CreateRelationDto();
		base.relation = relation;
		base.source = source;
		base.target = target;
		base.deleted = false;
		const inverse = new CreateRelationDto();
		inverse.relation = relation;
		inverse.source = target;
		inverse.target = source;
		inverse.deleted = false;
		return await this.productRelationsService.transactional(async (em) => {
			switch(relationIns.kind.id){
				case ProductsRelationKindsEnum.ProductToProduct:
					await this.ppRelationValuesService.state(base, em);
					if(relationIns.symmetric){
						await this.ppRelationValuesService.state(inverse, em);
					}
					break;
				case ProductsRelationKindsEnum.ProductToOffer:
					await this.poRelationValuesService.state(base, em);
					break;
				case ProductsRelationKindsEnum.OfferToProduct:
					await this.opRelationValuesService.state(base, em);
					break;
				case ProductsRelationKindsEnum.OfferToOffer:
					await this.ooRelationValuesService.state(base, em);
					if(relationIns.symmetric){
						await this.ooRelationValuesService.state(inverse, em);
					}
					break;
			}
		})
	}
	
	@Delete(':source/to/:target')
	@ApiOperation({summary: "Удаление определеннго взаимоотношения между товарами и/или товарными предложениями"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'relation', description: 'ID типа взаимоотношениия'})
	@ApiParam({name: 'source', description: 'ID источника (товара или товарного предложения) во взаимоотношении'})
	@ApiParam({name: 'target', description: 'ID цели (товара или товарного предложения) во взаимоотношении'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('relation', ParseIntPipe) relation: number, @Param('source', ParseBigIntPipe) source: bigint, @Param('target', ParseBigIntPipe) target: bigint) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || catalogIns.company.id!==actor.company.id){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const relationIns = await this.productRelationsService.findById(relation);
		if(relationIns===null || relationIns.catalog.id!==catalog){
			throw new HttpException('Relation not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.transactional(async (em) => {
			switch(relationIns.kind.id){
				case ProductsRelationKindsEnum.ProductToProduct:
					await this.ppRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.ppRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
				case ProductsRelationKindsEnum.ProductToOffer:
					await this.poRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					break;
				case ProductsRelationKindsEnum.OfferToProduct:
					await this.opRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					break;
				case ProductsRelationKindsEnum.OfferToOffer:
					await this.ooRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.ooRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
			}
		})
	}

}