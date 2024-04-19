/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in nested class file
 * in a proper way.
 */
import { AmountsController } from './controllers/amounts.controller';
import { BrandPropertyValuesController } from './controllers/brand-property-values.controller';
import { CatalogBrandCollectionsController } from './controllers/catalog-brand-collections.controller';
import { CatalogBrandsController } from './controllers/catalog-brands.controller';
import { CatalogMetatypePropertiesController } from './controllers/catalog-metatype-properties.controller';
import { CatalogProductOffersController } from './controllers/catalog-product-offers.controller';
import { CatalogProductsController } from './controllers/catalog-products.controller';
import { CatalogPropertiesController } from './controllers/catalog-properties.controller';
import { CatalogTypesController } from './controllers/catalog-types.controller';
import { CatalogsController } from './controllers/catalogs.controller';
import { CollectionPropertyValuesController } from './controllers/collection-property-values.controller';
import { CurrenciesController } from './controllers/currencies.controller';
import { FileLoadTasksController } from './controllers/file-load-tasks.controller';
import { MetatypesController } from './controllers/metatypes.controller';
import { OfferPricesController } from './controllers/offer-prices.controller';
import { OfferPropertyValuesController } from './controllers/offer-property-values.controller';
import { OptionsPropertyValuesController } from './controllers/options-property-values.controller';
import { PriceTypesController } from './controllers/price-types.controller';
import { ProductPricesController } from './controllers/product-prices.controller';
import { ProductPropertyValuesController } from './controllers/product-property-values.controller';
import { ProductRelationsController } from './controllers/product-relations.controller';
import { ProductsRelationKindsController } from './controllers/products-relation-kinds.controller';
import { PropertyInTypesController } from './controllers/property-in-types.controller';
import { PropertyPrimitivesController } from './controllers/property-primitives.controller';
import { PropertyTypesController } from './controllers/property-types.controller';
import { RatesSourcesController } from './controllers/rates-sources.controller';
import { RatesController } from './controllers/rates.controller';
import { RelationsController } from './controllers/relations.controller';
import { StoresController } from './controllers/stores.controller';
import { TypePropertyValuesController } from './controllers/type-property-values.controller';
import { UnitGroupsController } from './controllers/unit-groups.controller';
import { UnitsController } from './controllers/units.controller';
import { ActorTypesService } from './services/actor-types.service';
import { ActorsService } from './services/actors.service';
import { ApiKeysService } from './services/api-keys.service';
import { BrandPropertyValuesService } from './services/brand-property-values.service';
import { CatalogBrandCollectionsService } from './services/catalog-brand-collections.service';
import { CatalogBrandsService } from './services/catalog-brands.service';
import { CatalogMetatypePropertiesService } from './services/catalog-metatype-properties.service';
import { CatalogProductOffersService } from './services/catalog-product-offers.service';
import { CatalogProductsService } from './services/catalog-products.service';
import { CatalogPropertiesService } from './services/catalog-properties.service';
import { CatalogTypesOverloadService } from './services/catalog-types-overload.service';
import { CatalogTypesService } from './services/catalog-types.service';
import { CatalogsService } from './services/catalogs.service';
import { CollectionPropertyValuesService } from './services/collection-property-values.service';
import { CompaniesService } from './services/companies.service';
import { CurrenciesService } from './services/currencies.service';
import { FileLoadTasksService } from './services/file-load-tasks.service';
import { MetatypesService } from './services/metatypes.service';
import { OfferAmountsService } from './services/offer-amounts.service';
import { OfferPricesService } from './services/offer-prices.service';
import { OfferPropertyValuesService } from './services/offer-property-values.service';
import { OoRelationValuesService } from './services/oo-relation-values.service';
import { OpRelationValuesService } from './services/op-relation-values.service';
import { OptionsPropertyValuesService } from './services/options-property-values.service';
import { PoRelationValuesService } from './services/po-relation-values.service';
import { PpRelationValuesService } from './services/pp-relation-values.service';
import { PriceTypesService } from './services/price-types.service';
import { ProductPricesService } from './services/product-prices.service';
import { ProductPropertyValuesService } from './services/product-property-values.service';
import { ProductRelationsService } from './services/product-relations.service';
import { ProductsRelationKindsService } from './services/products-relation-kinds.service';
import { PropertyInTypesService } from './services/property-in-types.service';
import { PropertyPrimitivesService } from './services/property-primitives.service';
import { PropertyTypesService } from './services/property-types.service';
import { PropertyValuesService } from './services/property-values.service';
import { RatesHistoryService } from './services/rates-history.service';
import { RatesSourcesService } from './services/rates-sources.service';
import { RatesService } from './services/rates.service';
import { StoresService } from './services/stores.service';
import { TypePropertyValuesService } from './services/type-property-values.service';
import { UnitGroupsService } from './services/unit-groups.service';
import { UnitsService } from './services/units.service';
import { UsersService } from './services/users.service';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
	imports: [HttpModule],
	controllers: [AmountsController, BrandPropertyValuesController, CatalogBrandCollectionsController, CatalogBrandsController, CatalogMetatypePropertiesController, CatalogProductOffersController, CatalogProductsController, CatalogPropertiesController, CatalogTypesController, CatalogsController, CollectionPropertyValuesController, CurrenciesController, FileLoadTasksController, MetatypesController, OfferPricesController, OfferPropertyValuesController, OptionsPropertyValuesController, PriceTypesController, ProductPricesController, ProductPropertyValuesController, ProductRelationsController, ProductsRelationKindsController, PropertyInTypesController, PropertyPrimitivesController, PropertyTypesController, RatesController, RatesSourcesController, RelationsController, StoresController, TypePropertyValuesController, UnitGroupsController, UnitsController],
	providers: [ActorTypesService, ActorsService, ApiKeysService, BrandPropertyValuesService, CatalogBrandCollectionsService, CatalogBrandsService, CatalogMetatypePropertiesService, CatalogProductOffersService, CatalogProductsService, CatalogPropertiesService, CatalogTypesOverloadService, CatalogTypesService, CatalogsService, CollectionPropertyValuesService, CompaniesService, CurrenciesService, FileLoadTasksService, MetatypesService, OfferAmountsService, OfferPricesService, OfferPropertyValuesService, OoRelationValuesService, OpRelationValuesService, OptionsPropertyValuesService, PoRelationValuesService, PpRelationValuesService, PriceTypesService, ProductPricesService, ProductPropertyValuesService, ProductRelationsService, ProductsRelationKindsService, PropertyInTypesService, PropertyPrimitivesService, PropertyTypesService, PropertyValuesService, RatesHistoryService, RatesService, RatesSourcesService, StoresService, TypePropertyValuesService, UnitGroupsService, UnitsService, UsersService],
	exports: [ActorTypesService, ActorsService, ApiKeysService, BrandPropertyValuesService, CatalogBrandCollectionsService, CatalogBrandsService, CatalogMetatypePropertiesService, CatalogProductOffersService, CatalogProductsService, CatalogPropertiesService, CatalogTypesOverloadService, CatalogTypesService, CatalogsService, CollectionPropertyValuesService, CompaniesService, CurrenciesService, FileLoadTasksService, MetatypesService, OfferAmountsService, OfferPricesService, OfferPropertyValuesService, OoRelationValuesService, OpRelationValuesService, OptionsPropertyValuesService, PoRelationValuesService, PpRelationValuesService, PriceTypesService, ProductPricesService, ProductPropertyValuesService, ProductRelationsService, ProductsRelationKindsService, PropertyInTypesService, PropertyPrimitivesService, PropertyTypesService, PropertyValuesService, RatesHistoryService, RatesService, RatesSourcesService, StoresService, TypePropertyValuesService, UnitGroupsService, UnitsService, UsersService]
})
export class ExchangeApi { }