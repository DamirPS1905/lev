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
exports.Catalogs = void 0;
const CatalogBrands_1 = require("./CatalogBrands");
const CatalogMetatypeProperties_1 = require("./CatalogMetatypeProperties");
const CatalogProductOffers_1 = require("./CatalogProductOffers");
const CatalogProducts_1 = require("./CatalogProducts");
const CatalogProperties_1 = require("./CatalogProperties");
const CatalogTypes_1 = require("./CatalogTypes");
const Companies_1 = require("./Companies");
const ProductRelations_1 = require("./ProductRelations");
const PropertyTypes_1 = require("./PropertyTypes");
const core_1 = require("@mikro-orm/core");
let Catalogs = class Catalogs {
    constructor() {
        // gen - begin
        this.catalogTypesByCatalog = new core_1.Collection(this);
        this.catalogBrandsByCatalog = new core_1.Collection(this);
        this.propertyTypesByCatalog = new core_1.Collection(this);
        this.catalogProductsByCatalog = new core_1.Collection(this);
        this.catalogProductOffersByCatalog = new core_1.Collection(this);
        this.catalogPropertiesByCatalog = new core_1.Collection(this);
        this.catalogMetatypePropertiesByCatalog = new core_1.Collection(this);
        this.productRelationsByCatalog = new core_1.Collection(this);
        // gen - end
    }
};
exports.Catalogs = Catalogs;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Catalogs.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Catalogs.prototype, "title", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Companies_1.Companies, fieldName: 'company', hidden: true, unique: 'catalogs_company_title_uind' }),
    __metadata("design:type", Object)
], Catalogs.prototype, "company", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogTypes_1.CatalogTypes, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogTypesByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogBrands_1.CatalogBrands, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogBrandsByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PropertyTypes_1.PropertyTypes, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "propertyTypesByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProducts_1.CatalogProducts, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogProductsByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProductOffers_1.CatalogProductOffers, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogProductOffersByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProperties_1.CatalogProperties, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogPropertiesByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogMetatypeProperties_1.CatalogMetatypeProperties, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "catalogMetatypePropertiesByCatalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => ProductRelations_1.ProductRelations, mappedBy: 'catalog', hidden: true }),
    __metadata("design:type", Object)
], Catalogs.prototype, "productRelationsByCatalog", void 0);
exports.Catalogs = Catalogs = __decorate([
    (0, core_1.Entity)()
], Catalogs);
//# sourceMappingURL=Catalogs.js.map