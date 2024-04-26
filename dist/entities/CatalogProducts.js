"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogProducts = void 0;
const CatalogBrandCollections_1 = require("./CatalogBrandCollections");
const CatalogBrands_1 = require("./CatalogBrands");
const CatalogProductOffers_1 = require("./CatalogProductOffers");
const CatalogTypes_1 = require("./CatalogTypes");
const Catalogs_1 = require("./Catalogs");
const OpRelationValues_1 = require("./OpRelationValues");
const PoRelationValues_1 = require("./PoRelationValues");
const PpRelationValues_1 = require("./PpRelationValues");
const ProductPrices_1 = require("./ProductPrices");
const ProductPropertyValues_1 = require("./ProductPropertyValues");
const Units_1 = require("./Units");
const core_1 = require("@mikro-orm/core");
let CatalogProducts = class CatalogProducts {
    constructor() {
        this.offersCount = 0;
        // gen - begin
        this.catalogProductOffersByProduct = new core_1.Collection(this);
        this.productPricesByProduct = new core_1.Collection(this);
        this.productPropertyValuesByProduct = new core_1.Collection(this);
        this.ppRelationValuesByTarget = new core_1.Collection(this);
        this.ppRelationValuesBySource = new core_1.Collection(this);
        this.poRelationValuesBySource = new core_1.Collection(this);
        this.opRelationValuesByTarget = new core_1.Collection(this);
        // gen - end
    }
};
exports.CatalogProducts = CatalogProducts;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], CatalogProducts.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_products_catalog_title_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogProducts.prototype, "catalog", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogTypes_1.CatalogTypes, fieldName: 'type' }),
    __metadata("design:type", CatalogTypes_1.CatalogTypes)
], CatalogProducts.prototype, "type", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogBrands_1.CatalogBrands, fieldName: 'brand' }),
    __metadata("design:type", CatalogBrands_1.CatalogBrands)
], CatalogProducts.prototype, "brand", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CatalogProducts.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "created", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogBrandCollections_1.CatalogBrandCollections, fieldName: 'collection', deleteRule: 'set null', nullable: true }),
    __metadata("design:type", CatalogBrandCollections_1.CatalogBrandCollections)
], CatalogProducts.prototype, "collection", void 0);
__decorate([
    (0, core_1.Property)({ type: 'number', columnType: 'smallint' }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "offersCount", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Units_1.Units, fieldName: 'accounting_unit' }),
    __metadata("design:type", Units_1.Units)
], CatalogProducts.prototype, "accountingUnit", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], CatalogProducts.prototype, "image", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProductOffers_1.CatalogProductOffers, mappedBy: 'product', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "catalogProductOffersByProduct", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => ProductPrices_1.ProductPrices, mappedBy: 'product', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "productPricesByProduct", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => ProductPropertyValues_1.ProductPropertyValues, mappedBy: 'product', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "productPropertyValuesByProduct", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PpRelationValues_1.PpRelationValues, mappedBy: 'target', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "ppRelationValuesByTarget", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PpRelationValues_1.PpRelationValues, mappedBy: 'source', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "ppRelationValuesBySource", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PoRelationValues_1.PoRelationValues, mappedBy: 'source', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "poRelationValuesBySource", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OpRelationValues_1.OpRelationValues, mappedBy: 'target', hidden: true }),
    __metadata("design:type", Object)
], CatalogProducts.prototype, "opRelationValuesByTarget", void 0);
exports.CatalogProducts = CatalogProducts = __decorate([
    (0, core_1.Entity)()
], CatalogProducts);
//# sourceMappingURL=CatalogProducts.js.map