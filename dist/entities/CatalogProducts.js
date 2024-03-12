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
const core_1 = require("@mikro-orm/core");
const CatalogBrands_1 = require("./CatalogBrands");
const CatalogTypes_1 = require("./CatalogTypes");
const Catalogs_1 = require("./Catalogs");
let CatalogProducts = class CatalogProducts {
};
exports.CatalogProducts = CatalogProducts;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", BigInt)
], CatalogProducts.prototype, "id", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_products_catalog_title_uind' }),
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
    (0, core_1.Property)({ length: 6 }),
    __metadata("design:type", Date)
], CatalogProducts.prototype, "created", void 0);
exports.CatalogProducts = CatalogProducts = __decorate([
    (0, core_1.Entity)()
], CatalogProducts);
//# sourceMappingURL=CatalogProducts.js.map