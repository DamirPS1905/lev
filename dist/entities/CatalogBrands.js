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
exports.CatalogBrands = void 0;
const BrandPropertyValues_1 = require("./BrandPropertyValues");
const CatalogBrandCollections_1 = require("./CatalogBrandCollections");
const CatalogProducts_1 = require("./CatalogProducts");
const Catalogs_1 = require("./Catalogs");
const core_1 = require("@mikro-orm/core");
let CatalogBrands = class CatalogBrands {
    constructor() {
        // gen - begin
        this.catalogProductsByBrand = new core_1.Collection(this);
        this.brandPropertyValuesByInstance = new core_1.Collection(this);
        this.catalogBrandCollectionsByBrand = new core_1.Collection(this);
        // gen - end
    }
};
exports.CatalogBrands = CatalogBrands;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], CatalogBrands.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_brands_catalog_title_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogBrands.prototype, "catalog", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CatalogBrands.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'text', nullable: true }),
    __metadata("design:type", String)
], CatalogBrands.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ nullable: true }),
    __metadata("design:type", String)
], CatalogBrands.prototype, "image", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProducts_1.CatalogProducts, mappedBy: 'brand', hidden: true }),
    __metadata("design:type", Object)
], CatalogBrands.prototype, "catalogProductsByBrand", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => BrandPropertyValues_1.BrandPropertyValues, mappedBy: 'instance', hidden: true }),
    __metadata("design:type", Object)
], CatalogBrands.prototype, "brandPropertyValuesByInstance", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogBrandCollections_1.CatalogBrandCollections, mappedBy: 'brand', hidden: true }),
    __metadata("design:type", Object)
], CatalogBrands.prototype, "catalogBrandCollectionsByBrand", void 0);
exports.CatalogBrands = CatalogBrands = __decorate([
    (0, core_1.Entity)()
], CatalogBrands);
//# sourceMappingURL=CatalogBrands.js.map