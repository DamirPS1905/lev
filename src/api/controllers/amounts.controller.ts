import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { OfferAmountDto } from './../dtos/offer-amount.dto'
import { UpdateOfferAmountDto } from './../dtos/update-offer-amount.dto'
import { CatalogProductOffersService } from './../services/catalog-product-offers.service';
import { CatalogProductsService } from './../services/catalog-products.service';
import { CatalogsService } from './../services/catalogs.service';
import { OfferAmountsService } from './../services/offer-amounts.service';
import { PropertyTypesService } from './../services/property-types.service';
import { StoresService } from './../services/stores.service';
import { UnitsService } from './../services/units.service';
import { EntityManager, wrap } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards, Body, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ParseBigIntPipe } from './../../pipes/parse-bigint.pipe'
import { ApiHeader, ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Amounts')
@Controller('catalog/:catalog')
export class AmountsController{
	
	constructor(
		protected readonly catalogProductOffersService: CatalogProductOffersService,
		protected readonly catalogProductsService: CatalogProductsService,
		protected readonly catalogsService: CatalogsService,
		protected readonly offerAmountsService: OfferAmountsService,
		protected readonly propertyTypesService: PropertyTypesService,
		protected readonly storesService: StoresService,
		protected readonly unitsService: UnitsService,
	) { }
		
	@Get('offer/:offer/store/all')
	@ApiOperation({summary: "Получение остаков товарного предложения на всех складах"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	async findAllByOffer(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint) {
		const offerIns = await this.validateOfferPath(actor, catalog, offer);
		return await this.offerAmountsService.readAllByOffer(offer);
	}
	
	@Get('product/:product/store/all')
	@ApiOperation({summary: "Получение остаков товарного предложения на всех складах"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	async findAllByProduct(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint) {
		const offerIns = await this.validateProductPath(actor, catalog, product);
		return await this.offerAmountsService.readAllByOffer(offerIns.id);
	}
	
	@Get('offer/:offer/store/:store/amount')
	@ApiOperation({summary: "Получение остаков товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async findOfferOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		const offerIns = await this.validateOfferPath(actor, catalog, offer, store);
		const entity = await this.offerAmountsService.findByOfferAndStore(offer, store);
		if(entity!==null){
			return entity.amount;
		}
		return 0;
	}
	
	@Get('product/:product/store/:store/amount')
	@ApiOperation({summary: "Получение остаков товара без товарных предложений (или с одним товарным предложением) на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async findProdutOne(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('store', ParseIntPipe) store: number) {
		const offerIns = await this.validateProductPath(actor, catalog, product, store);
		const entity = await this.offerAmountsService.findByOfferAndStore(offerIns.id, store);
		if(entity!==null){
			return entity.amount;
		}
		return 0;
	}
	
	@Patch('product/:product/store/:store/amount')
	@ApiOperation({summary: "Задание или обновление остаков товара без товарных предложений (или с одним товарным предложением) на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товара'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async updateProduct(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('store', ParseIntPipe) store: number, @Body() dto: OfferAmountDto) {
		const offerIns = await this.validateProductPath(actor, catalog, product, store),
					updateDto = await this.convertDto(actor, offerIns, dto);
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offerIns.id, store, em);
			if(entity!==null){
				return await this.offerAmountsService.update(entity, updateDto, em);
			} else {
				updateDto.store = store; 
				updateDto.offer = offerIns.id; 
				return await this.offerAmountsService.create(updateDto, em);
			}
		});
	}
	
	@Patch('offer/:offer/store/:store/amount')
	@ApiOperation({summary: "Задание или обновление остаков товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async updateOffer(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number, @Body() dto: OfferAmountDto) {
		const offerIns = await this.validateOfferPath(actor, catalog, offer, store),
					updateDto = await this.convertDto(actor, offerIns, dto);
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if(entity!==null){
				return await this.offerAmountsService.update(entity, updateDto, em);
			} else {
				updateDto.store = store; 
				updateDto.offer = offer; 
				return await this.offerAmountsService.create(updateDto, em);
			}
		});
	}
	
	protected async convertDto(actor: Actors, offerIns, dto: OfferAmountDto){
		const updateDto = new UpdateOfferAmountDto();
		updateDto.amount = dto.amount; 
		if(updateDto.hasOwnProperty('unit')){
			await wrap(offerIns.product).init();
			if(offerIns.product.accountingUnit.id!==dto.unit){
				await wrap(offerIns.product.accountingUnit).init();
				const sourceUnit = await this.unitsService.findById(dto.unit);
				if(sourceUnit===null || (sourceUnit.company!==null && sourceUnit.company.id!==actor.company.id)){
					throw new HttpException('Unit not found', HttpStatus.NOT_FOUND);
				}
				if(sourceUnit.group.id!==unit.group.id){
					throw new HttpException('Unit belongs to wrong units group', HttpStatus.CONFLICT);
				}
				updateDto.amount = this.propertyTypesService.convertValue(sourceUnit, offerIns.product.accountingUnit, parseFloat(dto.amount)).toString(); 
			}
		}
		return updateDto;
	}
	
	private async commonValidatePath(actor: Actors, catalog: number, store: number){
		const catalogIns = await this.catalogsService.findById(catalog);
		if(catalogIns===null || !(catalogIns.company.id===actor.company.id)){
			throw new HttpException('Catalog not found', HttpStatus.NOT_FOUND);
		}
		if(store!==null){
			const storeIns = await this.storesService.findById(store);
			if(storeIns===null || !(storeIns.company.id===actor.company.id)){
				throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
			}
		}
	}
	
	private async validateOfferPath(actor: Actors, catalog: number, offer: bigint, store: number = null){
		await this.commonValidatePath(actor, catalog, store);
		const offerIns = await this.catalogProductOffersService.findById(offer);
		if(offerIns===null || offerIns.article===null || !(offerIns.catalog.id===catalog)){
			throw new HttpException('Offer not found', HttpStatus.NOT_FOUND);
		}
		return offerIns;
	}
	
	private async validateProductPath(actor: Actors, catalog: number, product: bigint, store: number = null){
		await this.commonValidatePath(actor, catalog, store);
		const productIns = await this.catalogProductsService.findById(product);
		if(productIns===null || !(productIns.catalog.id===catalog)){
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}
		if(productIns.offersCount>1){
			throw new HttpException('Product has many offers', HttpStatus.CONFLICT);
		}
		if(productIns.offersCount===0){
			return await this.catalogProductOffersService.findNullOfferByProduct(product);
		}else{
			return await this.catalogProductOffersService.findOneByProduct(product);
		}
	}
	
	@Delete('offer/:offer/store/:store/amount')
	@ApiOperation({summary: "Удаление записи об остаках товарного предложения на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'offer', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async deleteOffer(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('offer', ParseBigIntPipe) offer: bigint, @Param('store', ParseIntPipe) store: number) {
		const offerIns = await this.validateOfferPath(actor, catalog, offer, store);
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offer, store, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			return await this.offerAmountsService.remove(entity, em);
		});
	}
	
	@Delete('product/:product/store/:store/amount')
	@ApiOperation({summary: "Удаление записи об остаках товара без товарных предложений (или с одним товарным предложением) на определенном складе"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'product', description: 'ID товарного предложения'})
	@ApiParam({name: 'store', description: 'ID склада'})
	async deleteProduct(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('product', ParseBigIntPipe) product: bigint, @Param('store', ParseIntPipe) store: number) {
		const offerIns = await this.validateProductPath(actor, catalog, product, store);
		return await this.offerAmountsService.transactional(async (em) => {
			const entity = await this.offerAmountsService.findByOfferAndStore(offerIns.id, store, em);
			if(entity!==null){
				return await this.offerAmountsService.remove(entity, em);
			}
		});
	}
	
	
}