import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogProductDto } from './../dtos/create-catalog-product.dto'
import { UpdateCatalogProductDto } from './../dtos/update-catalog-product.dto'
import { CreateProductDto } from './../dtos/create-product.dto'
import { UpdateProductDto } from './../dtos/update-product.dto'
import { CatalogProductsService } from './../services/catalog-products.service'
import { GenCatalogProductsController } from './gen/catalog-products.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiQuery, ApiOperation, ApiParam } from '@nestjs/swagger'
import { refill } from './../../util/utils';

export class CatalogProductsController extends GenCatalogProductsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка товаров в каталоге (с пагинацией)"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiQuery({name: 'limit', description: 'Maximum count of returning entities', required: false})
	@ApiQuery({ name: 'offset', description: 'Count of skipping entities', required: false})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
		return await super.findAll(actor, catalog, offset, limit);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID товара'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.findOne(actor, catalog, id);
	}
	
	@Post()
	@ApiOperation({summary: "Создание товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Body() createDto: CreateProductDto) {
		createDto.catalog = catalog;
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em, fm) => {
			const existed0 = await this.catalogProductsService.findByCatalogAndTitle(catalog, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
			}
			const brandIns = await this.catalogBrandsService.findById(createDto.brand);
			if(brandIns===null || !(brandIns.catalog.id===catalog)){
				throw new HttpException('Brand not found', HttpStatus.CONFLICT);
			}
			const typeIns = await this.catalogTypesService.findById(createDto.type);
			if(typeIns===null || !(typeIns.catalog.id===catalog)){
				throw new HttpException('Type not found', HttpStatus.CONFLICT);
			}
			if(createDto.collection!==null){
				if(createDto.collection!==undefined){
					const tmp = await this.catalogBrandCollectionsService.findById(createDto.collection, em);
					if(tmp===null){
						throw new HttpException('Not found contrainst (collection)', HttpStatus.CONFLICT);
					}
				}
			}
			const accountingUnitIns = await this.unitsService.findById(createDto.accountingUnit);
			if(accountingUnitIns===null || !(accountingUnitIns.company===null || accountingUnitIns.company.id===actor.company.id)){
				throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
			}
			if(createDto.image){
				createDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, createDto.image, true, em, fm);
			}
			const createProductDto = refill(CreateCatalogProductDto, createDto, ['article']);
			const product = await this.catalogProductsService.create(createProductDto, em);
			if(createDto.hasOwnProperty('article')){
				const nullOffer = await this.catalogProductOffersService.findNullOfferByProduct(product.id, em);
				nullOffer.article = createDto.article;
				await em.persist(nullOffer)
			}
			return product;
		});
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление информации об определенном товаре"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID товара'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint, @Body() updateDto: UpdateProductDto) {
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		return await this.catalogProductsService.transactional(async (em, fm) => {
			const entity = await this.catalogProductsService.findById(id, em);
			if(updateDto.brand!==undefined){
				const brandIns = await this.catalogBrandsService.findById(updateDto.brand);
				if(brandIns===null || !(brandIns.catalog.id===catalog)){
					throw new HttpException('Brand not found', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.type!==undefined){
				const typeIns = await this.catalogTypesService.findById(updateDto.type);
				if(typeIns===null || !(typeIns.catalog.id===catalog)){
					throw new HttpException('Type not found', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.collection!==null){
				if(updateDto.collection!==undefined){
					const tmp = await this.catalogBrandCollectionsService.findById(updateDto.collection, em);
					if(tmp===null){
						throw new HttpException('Not found contrainst (collection)', HttpStatus.CONFLICT);
					}
				}
			}
			if(updateDto.accountingUnit!==undefined){
				const accountingUnitIns = await this.unitsService.findById(updateDto.accountingUnit);
				if(accountingUnitIns===null || !(accountingUnitIns.company===null || accountingUnitIns.company.id===actor.company.id)){
					throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
				}
			}
			if(entity===null || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed = await this.catalogProductsService.findByCatalogAndTitle(entity.catalog.id, updateDto.title, em);
				if(existed!==null && (entity.id!==existed.id)){
					throw new HttpException('Duplicate (catalog, title)', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.image){
				updateDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, updateDto.image, true, em, fm);
			}
			const updateProductDto = refill(UpdateCatalogProductDto, updateDto, ['article']);
			const product = await this.catalogProductsService.update(entity, updateProductDto, em);
			if(updateDto.hasOwnProperty('article')){
				if(product.offersCount>1){
					throw new HttpException('Unable to apply article: product has many offers', HttpStatus.CONFLICT);
				}
				const firstOffer = await this.catalogProductOffersService.findOneByProduct(product.id, em);
				firstOffer.article = updateDto.article;
				await em.persist(firstOffer);
			}
			return product;
		});
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID товара'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseBigIntPipe) id: bigint) {
		return await super.delete(actor, catalog, id);
	}
	
	
}