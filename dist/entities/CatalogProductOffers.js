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
exports.CatalogProductOffers = void 0;
const CatalogProducts_1 = require("./CatalogProducts");
const Catalogs_1 = require("./Catalogs");
const OfferAmounts_1 = require("./OfferAmounts");
const OfferPrices_1 = require("./OfferPrices");
const OfferPropertyValues_1 = require("./OfferPropertyValues");
const OoRelationValues_1 = require("./OoRelationValues");
const OpRelationValues_1 = require("./OpRelationValues");
const PoRelationValues_1 = require("./PoRelationValues");
const Stores_1 = require("./Stores");
const core_1 = require("@mikro-orm/core");
let CatalogProductOffers = class CatalogProductOffers {
    constructor() {
        this.offerAmounts = new core_1.Collection(this);
        // gen - begin
        this.offerPricesByOffer = new core_1.Collection(this);
        this.offerAmountsByOffer = new core_1.Collection(this);
        this.offerPropertyValuesByOffer = new core_1.Collection(this);
        this.poRelationValuesByTarget = new core_1.Collection(this);
        this.opRelationValuesBySource = new core_1.Collection(this);
        this.ooRelationValuesByTarget = new core_1.Collection(this);
        this.ooRelationValuesBySource = new core_1.Collection(this);
        // gen - end
    }
};
exports.CatalogProductOffers = CatalogProductOffers;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], CatalogProductOffers.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProducts_1.CatalogProducts, fieldName: 'product', unique: 'catalog_product_offers_product_article_uind' }),
    __metadata("design:type", CatalogProducts_1.CatalogProducts)
], CatalogProductOffers.prototype, "product", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_product_offers_catalog_article_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogProductOffers.prototype, "catalog", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], CatalogProductOffers.prototype, "article", void 0);
__decorate([
    (0, core_1.Property)({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "created", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], CatalogProductOffers.prototype, "image", void 0);
__decorate([
    (0, core_1.ManyToMany)({ entity: () => Stores_1.Stores, pivotTable: 'offer_amounts', pivotEntity: () => OfferAmounts_1.OfferAmounts, joinColumn: 'offer', inverseJoinColumn: 'store', fixedOrder: true, fixedOrderColumn: 'version', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "offerAmounts", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OfferPrices_1.OfferPrices, mappedBy: 'offer', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "offerPricesByOffer", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OfferAmounts_1.OfferAmounts, mappedBy: 'offer', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "offerAmountsByOffer", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OfferPropertyValues_1.OfferPropertyValues, mappedBy: 'offer', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "offerPropertyValuesByOffer", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PoRelationValues_1.PoRelationValues, mappedBy: 'target', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "poRelationValuesByTarget", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OpRelationValues_1.OpRelationValues, mappedBy: 'source', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "opRelationValuesBySource", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OoRelationValues_1.OoRelationValues, mappedBy: 'target', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "ooRelationValuesByTarget", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OoRelationValues_1.OoRelationValues, mappedBy: 'source', hidden: true }),
    __metadata("design:type", Object)
], CatalogProductOffers.prototype, "ooRelationValuesBySource", void 0);
exports.CatalogProductOffers = CatalogProductOffers = __decorate([
    (0, core_1.Entity)()
], CatalogProductOffers);
//# sourceMappingURL=CatalogProductOffers.js.map