/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in nested class file
 * in a proper way.
 */
import { CatalogBrandsController } from './controllers/catalog-brands.controller'
import { CatalogProductOffersController } from './controllers/catalog-product-offers.controller'
import { CatalogProductsController } from './controllers/catalog-products.controller'
import { CatalogPropertiesController } from './controllers/catalog-properties.controller'
import { CatalogTypesController } from './controllers/catalog-types.controller'
import { CatalogsController } from './controllers/catalogs.controller'
import { CurrenciesController } from './controllers/currencies.controller'
import { MetatypesController } from './controllers/metatypes.controller'
import { OfferAmountsController } from './controllers/offer-amounts.controller'
import { OfferPropertyValuesController } from './controllers/offer-property-values.controller'
import { OffersPricesController } from './controllers/offers-prices.controller'
import { OptionsPropertyValuesController } from './controllers/options-property-values.controller'
import { PriceTypesController } from './controllers/price-types.controller'
import { ProductPricesController } from './controllers/product-prices.controller'
import { ProductPropertyValuesController } from './controllers/product-property-values.controller'
import { PropertyTypesController } from './controllers/property-types.controller'
import { RatesHistoryController } from './controllers/rates-history.controller'
import { RatesSourcesController } from './controllers/rates-sources.controller'
import { RatesController } from './controllers/rates.controller'
import { StoresController } from './controllers/stores.controller'
import { UnitGroupsController } from './controllers/unit-groups.controller'
import { UnitsController } from './controllers/units.controller'
import { ActorTypesService } from './services/actor-types.service'
import { ActorsService } from './services/actors.service'
import { ApiKeysService } from './services/api-keys.service'
import { CatalogBrandsService } from './services/catalog-brands.service'
import { CatalogMetatypesService } from './services/catalog-metatypes.service'
import { CatalogProductOffersService } from './services/catalog-product-offers.service'
import { CatalogProductsService } from './services/catalog-products.service'
import { CatalogPropertiesService } from './services/catalog-properties.service'
import { CatalogTypesOverloadService } from './services/catalog-types-overload.service'
import { CatalogTypesService } from './services/catalog-types.service'
import { CatalogsService } from './services/catalogs.service'
import { CompaniesService } from './services/companies.service'
import { CurrenciesService } from './services/currencies.service'
import { MetatypesService } from './services/metatypes.service'
import { OfferAmountsService } from './services/offer-amounts.service'
import { OfferPropertyValuesService } from './services/offer-property-values.service'
import { OffersPricesService } from './services/offers-prices.service'
import { OptionsPropertyValuesService } from './services/options-property-values.service'
import { PriceTypesService } from './services/price-types.service'
import { ProductPricesService } from './services/product-prices.service'
import { ProductPropertyValuesService } from './services/product-property-values.service'
import { PropertyTypesService } from './services/property-types.service'
import { PropertyValuesService } from './services/property-values.service'
import { RatesHistoryService } from './services/rates-history.service'
import { RatesSourcesService } from './services/rates-sources.service'
import { RatesService } from './services/rates.service'
import { StoresService } from './services/stores.service'
import { UnitGroupsService } from './services/unit-groups.service'
import { UnitsService } from './services/units.service'
import { UsersService } from './services/users.service'
import { Module } from '@nestjs/common'

@Module({
	controllers: [CatalogsController, CatalogTypesController, CatalogProductsController, CatalogProductOffersController, PropertyTypesController, CatalogBrandsController, CatalogPropertiesController, OptionsPropertyValuesController, CurrenciesController, RatesSourcesController, RatesController, MetatypesController, UnitGroupsController, UnitsController, RatesHistoryController, ProductPropertyValuesController, PriceTypesController, ProductPricesController, OffersPricesController, StoresController, OfferAmountsController, OfferPropertyValuesController],
	providers: [CatalogsService, CatalogTypesService, CatalogProductsService, CatalogProductOffersService, PropertyTypesService, CatalogTypesOverloadService, CatalogBrandsService, ActorTypesService, ActorsService, CatalogPropertiesService, OptionsPropertyValuesService, ApiKeysService, UsersService, CompaniesService, CurrenciesService, RatesSourcesService, RatesService, MetatypesService, CatalogMetatypesService, UnitGroupsService, UnitsService, RatesHistoryService, ProductPropertyValuesService, PriceTypesService, ProductPricesService, OffersPricesService, StoresService, OfferAmountsService, PropertyValuesService, OfferPropertyValuesService]
})
export class ExchangeApi { }