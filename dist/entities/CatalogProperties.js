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
const core_1 = require("@mikro-orm/core");
const PropertyTypes_1 = require("./PropertyTypes");
let CatalogProperties = class CatalogProperties {
    constructor() {
        this.multiple = false;
        this.options = false;
    }
};
exports.CatalogProperties = CatalogProperties;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], CatalogProperties.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Number)
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
exports.CatalogProperties = CatalogProperties = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'catalog_properties_catalog_title_uind', properties: ['catalog', 'title'] })
], CatalogProperties);
//# sourceMappingURL=CatalogProperties.js.map