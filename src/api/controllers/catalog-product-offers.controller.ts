import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogProductOfferDto } from './../dtos/create-catalog-product-offer.dto'
import { UpdateCatalogProductOfferDto } from './../dtos/update-catalog-product-offer.dto'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service';
import { CatalogProductsService } from './../services/catalog-products.service';
import { CatalogsService } from './../services/catalogs.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiHeader, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'
import { refill } from './../../util/utils';
import { FileLoadTasksService } from './../services/file-load-tasks.service';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalog product offers')
@Controller('catalog/:catalog/product/:product/offer')
export class CatalogProductOffersController{
	
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
		protected readonly fileLoadTasksService: FileLoadTasksService,
	) { }
	
	@Get('all')
	@ApiOperation({summary: "Получение списка товарных предложений товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint) {
		const productIns = await this.validatePath(actor, catalog, product);
		return await this.catalogProductOffersService.findAllNotNullByProduct(product);
	}
	
	@Get(':id')
	@ApiOperation({summary: "Получение определенного товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async findOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		const productIns = await this.validatePath(actor, catalog, product);
		const entity = await this.catalogProductOffersService.findById(id);
		if(entity===null || entity.article===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		return entity;
	}
	
	@Post()
	@ApiOperation({summary: "Создание товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async create(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Body() createDto: CreateCatalogProductOfferDto) {
		createDto.product = product;
		createDto.catalog = catalog;
		if(createDto.article===undefined || createDto.article===null){
			throw new HttpException('Article cannot be empty', HttpStatus.CONFLICT);
		}
		const productIns = await this.validatePath(actor, catalog, product);
		return await this.catalogProductOffersService.transactional(async (em, fm) => {
			const existed0 = await this.catalogProductOffersService.findByCatalogAndArticle(catalog, createDto.article, em);
			if(existed0!==null){
				throw new HttpException('Offer with the same artice already exists in catalog', HttpStatus.CONFLICT);
			}
			if(createDto.image){
				createDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, createDto.image, true, em, fm);
			}
			if(productIns.offersCount===0){
				const nullOffer = await this.catalogProductOffersService.findNullOfferByProduct(product, em);
				return await this.catalogProductOffersService.update(nullOffer, refill(UpdateCatalogProductOfferDto, {
					article: createDto.article,
					created: new Date(),
					image: createDto.image
				}), em);
			}
			return await this.catalogProductOffersService.create(createDto, em);
		});
	}
	
	@Patch(':id')
	@ApiOperation({summary: "Обновление инормации об определенном товарном предложении товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async update(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint, @Body() updateDto: UpdateCatalogProductOfferDto) {
		if(updateDto.hasOwnProperty('article')){
			if(updateDto.article===undefined || updateDto.article===null){
				throw new HttpException('Article cannot be empty', HttpStatus.CONFLICT);
			}
		}
		const productIns = await this.validatePath(actor, catalog, product);
		return await this.catalogProductOffersService.transactional(async (em, fm) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			if(entity===null || entity.article===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.article!==undefined && updateDto.article!==entity.article)){
				const existed = await this.catalogProductOffersService.findByCatalogAndArticle(entity.catalog.id, updateDto.article, em);
				if(existed!==null && entity.id!==existed.id){
					throw new HttpException('Offer with the same artice already exists in catalog', HttpStatus.CONFLICT);
				}
			}
			if(updateDto.image){
				updateDto.image = await this.fileLoadTasksService.processInput(actor.company.id, catalog, updateDto.image, true, em, fm);
			}
			return await this.catalogProductOffersService.update(entity, updateDto, em);
		});
	}
	
	@Delete(':id')
	@ApiOperation({summary: "Удаление определенного товарного предложения товара"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'id', description: 'ID товарного предложения'})
	async delete(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('id', ParseBigIntPipe) id: bigint) {
		const productIns = await this.validatePath(actor, catalog, product);
		return await this.catalogProductOffersService.transactional(async (em) => {
			const entity = await this.catalogProductOffersService.findById(id, em);
			if(entity===null || entity.article===null || !(entity.product.id===product) || !(entity.catalog.id===catalog)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await wrap(entity.product).init();
			if(entity.product.offersCount===1){
				await this.catalogProductOffersService.remove(entity, em);
				await this.catalogProductOffersService.create(refill(CreateCatalogProductOfferDto, {
					article: null,
					product: product,
					catalog: catalog
				}), em);
			}else{
				await this.catalogProductOffersService.remove(entity, em);
			}
		});
	}
	
	private async validatePath(actor: Actors, catalog: number, product: bigint){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		return productIns;
	}
	
}