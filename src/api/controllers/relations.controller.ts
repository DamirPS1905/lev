import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateRelationDto } from './../dtos/create-relation.dto';
import { CatalogsService } from './../services/catalogs.service';
import { ProductRelationsService } from './../services/product-relations.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Controller, HttpException, HttpStatus, UseGuards, Body, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { PpRelationValuesService } from './../services/pp-relation-values.service';
import { PoRelationValuesService } from './../services/po-relation-values.service';
import { OpRelationValuesService } from './../services/op-relation-values.service';
import { OoRelationValuesService } from './../services/oo-relation-values.service';
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service';
import { CatalogProductsService } from './../services/catalog-products.service';

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
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case 1:
				return await this.ppRelationValuesService.getAllTargets(relation, source);
			case 2:
				return await this.poRelationValuesService.getAllTargets(relation, source);
			case 3:
				return await this.opRelationValuesService.getAllTargets(relation, source);
			case 4:
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
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case 1:
				return await this.ppRelationValuesService.getAllSources(relation, target);				break;
			case 2:
				return await this.poRelationValuesService.getAllSources(relation, target);
			case 3:
				return await this.opRelationValuesService.getAllSources(relation, target);
			case 4:
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
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		switch(relationIns.kind.id){
			case 1:
			case 2:
				const productIns = await this.catalogProductsService.findById(source);
				if(productIns===null || productIns.catalog.id!==catalog){
					throw new HttpException('Source product not found', HttpStatus.NOT_FOUND);
				}
				break;
			case 3:
			case 4:
				const offerIns = await this.catalogProductOffersService.findById(source);
				if(offerIns===null || offerIns.catalog.id!==catalog){
					throw new HttpException('Source product offer not found', HttpStatus.NOT_FOUND);
				}
				break;
		}
		switch(relationIns.kind.id){
			case 1:
			case 3:
				const productIns = await this.catalogProductsService.findById(target);
				if(productIns===null || productIns.catalog.id!==catalog){
					throw new HttpException('Source product not found', HttpStatus.NOT_FOUND);
				}
				break;
			case 2:
			case 4:
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
		const inverse = new CreateRelationDto();
		inverse.relation = relation;
		inverse.source = target;
		inverse.target = source;
		return await this.productRelationsService.transactional(async (em) => {
			switch(relationIns.kind.id){
				case 1:
					await this.ppRelationValuesService.create(base, em);
					if(relationIns.symmetric){
						await this.ppRelationValuesService.create(inverse, em);
					}
					break;
				case 2:
					await this.poRelationValuesService.create(base, em);
					if(relationIns.symmetric){
						await this.opRelationValuesService.create(inverse, em);
					}
					break;
				case 3:
					await this.opRelationValuesService.create(base, em);
					if(relationIns.symmetric){
						await this.poRelationValuesService.create(inverse, em);
					}
					break;
				case 4:
					await this.ooRelationValuesService.create(base, em);
					if(relationIns.symmetric){
						await this.ooRelationValuesService.create(inverse, em);
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
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		return await this.productRelationsService.transactional(async (em) => {
			switch(relationIns.kind.id){
				case 1:
					await this.ppRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.ppRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
				case 2:
					await this.poRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.opRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
				case 3:
					await this.opRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.poRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
				case 4:
					await this.ooRelationValuesService.removeByRelationAndSourceAndTarget(relation, source, target, em);
					if(relationIns.symmetric){
						await this.ooRelationValuesService.removeByRelationAndSourceAndTarget(relation, target, source, em);
					}
					break;
			}
		})
	}

}