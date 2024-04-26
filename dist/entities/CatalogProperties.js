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
exports.CatalogProperties = void 0;
const BrandPropertyValues_1 = require("./BrandPropertyValues");
const CatalogMetatypeProperties_1 = require("./CatalogMetatypeProperties");
const Catalogs_1 = require("./Catalogs");
const CollectionPropertyValues_1 = require("./CollectionPropertyValues");
const OfferPropertyValues_1 = require("./OfferPropertyValues");
const OptionsPropertyValues_1 = require("./OptionsPropertyValues");
const ProductPropertyValues_1 = require("./ProductPropertyValues");
const PropertyInTypes_1 = require("./PropertyInTypes");
const PropertyTypes_1 = require("./PropertyTypes");
const TypePropertyValues_1 = require("./TypePropertyValues");
const core_1 = require("@mikro-orm/core");
let CatalogProperties = class CatalogProperties {
    constructor() {
        this.multiple = false;
        this.options = false;
        // gen - begin
        this.optionsPropertyValuesByProperty = new core_1.Collection(this);
        this.propertyInTypesByProperty = new core_1.Collection(this);
        this.catalogMetatypePropertiesByProperty = new core_1.Collection(this);
        this.brandPropertyValuesByProperty = new core_1.Collection(this);
        this.typePropertyValuesByProperty = new core_1.Collection(this);
        this.productPropertyValuesByProperty = new core_1.Collection(this);
        this.offerPropertyValuesByProperty = new core_1.Collection(this);
        this.collectionPropertyValuesByProperty = new core_1.Collection(this);
        // gen - end
    }
};
exports.CatalogProperties = CatalogProperties;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], CatalogProperties.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', unique: 'catalog_properties_catalog_title_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogProperties.prototype, "catalog", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CatalogProperties.prototype, "title", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => PropertyTypes_1.PropertyTypes, fieldName: 'type' }),
    __metadata("design:type", PropertyTypes_1.PropertyTypes)
], CatalogProperties.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ type: 'boolean' }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "multiple", void 0);
__decorate([
    (0, core_1.Property)({ type: 'boolean' }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "options", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'jsonb' }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "scheme", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OptionsPropertyValues_1.OptionsPropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "optionsPropertyValuesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PropertyInTypes_1.PropertyInTypes, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "propertyInTypesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogMetatypeProperties_1.CatalogMetatypeProperties, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "catalogMetatypePropertiesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => BrandPropertyValues_1.BrandPropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "brandPropertyValuesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => TypePropertyValues_1.TypePropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "typePropertyValuesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => ProductPropertyValues_1.ProductPropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "productPropertyValuesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => OfferPropertyValues_1.OfferPropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "offerPropertyValuesByProperty", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CollectionPropertyValues_1.CollectionPropertyValues, mappedBy: 'property', hidden: true }),
    __metadata("design:type", Object)
], CatalogProperties.prototype, "collectionPropertyValuesByProperty", void 0);
exports.CatalogProperties = CatalogProperties = __decorate([
    (0, core_1.Entity)()
], CatalogProperties);
//# sourceMappingURL=CatalogProperties.js.map