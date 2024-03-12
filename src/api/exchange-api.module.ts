import { CatalogBrandsController } from './controllers/catalog-brands.controller'
import { CatalogProductOffersController } from './controllers/catalog-product-offers.controller'
import { CatalogProductsController } from './controllers/catalog-products.controller'
import { CatalogPropertiesController } from './controllers/catalog-properties.controller'
import { CatalogTypesController } from './controllers/catalog-types.controller'
import { OfferPropertyValuesController } from './controllers/offer-property-values.controller'
import { OptionsPropertyValuesController } from './controllers/options-property-values.controller'
import { ProductPropertyValuesController } from './controllers/product-property-values.controller'
import { PropertyTypesController } from './controllers/property-types.controller'
import { ActorTypesService } from './services/actor-types.service'
import { ActorsService } from './services/actors.service'
import { ApiKeysService } from './services/api-keys.service'
import { CatalogBrandsService } from './services/catalog-brands.service'
import { CatalogProductOffersService } from './services/catalog-product-offers.service'
import { CatalogProductsService } from './services/catalog-products.service'
import { CatalogPropertiesService } from './services/catalog-properties.service'
import { CatalogTypesOverloadService } from './services/catalog-types-overload.service'
import { CatalogTypesService } from './services/catalog-types.service'
import { CatalogsService } from './services/catalogs.service'
import { CompaniesService } from './services/companies.service'
import { OfferPropertyValuesService } from './services/offer-property-values.service'
import { OptionsPropertyValuesService } from './services/options-property-values.service'
import { ProductPropertyValuesService } from './services/product-property-values.service'
import { PropertyTypesService } from './services/property-types.service'
import { UsersService } from './services/users.service'
import { Module } from '@nestjs/common'

@Module({
	controllers: [CatalogTypesController, CatalogBrandsController, CatalogProductsController, CatalogProductOffersController, PropertyTypesController, OfferPropertyValuesController, CatalogPropertiesController, OptionsPropertyValuesController, ProductPropertyValuesController],
	providers: [CatalogsService, CatalogTypesService, CatalogBrandsService, CatalogProductsService, CatalogProductOffersService, PropertyTypesService, CatalogTypesOverloadService, OfferPropertyValuesService, ActorTypesService, ActorsService, CatalogPropertiesService, OptionsPropertyValuesService, ApiKeysService, UsersService, CompaniesService, ProductPropertyValuesService]
})
export class ExchangeApi { }