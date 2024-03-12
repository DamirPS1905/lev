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
const core_1 = require("@mikro-orm/core");
const CatalogProducts_1 = require("./CatalogProducts");
const Catalogs_1 = require("./Catalogs");
let CatalogProductOffers = class CatalogProductOffers {
};
exports.CatalogProductOffers = CatalogProductOffers;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", BigInt)
], CatalogProductOffers.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProducts_1.CatalogProducts, fieldName: 'product' }),
    __metadata("design:type", CatalogProducts_1.CatalogProducts)
], CatalogProductOffers.prototype, "product", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_product_offers_catalog_article_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogProductOffers.prototype, "catalog", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CatalogProductOffers.prototype, "article", void 0);
__decorate([
    (0, core_1.Property)({ length: 6 }),
    __metadata("design:type", Date)
], CatalogProductOffers.prototype, "created", void 0);
exports.CatalogProductOffers = CatalogProductOffers = __decorate([
    (0, core_1.Entity)()
], CatalogProductOffers);
//# sourceMappingURL=CatalogProductOffers.js.map