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
exports.ProductPropertyValues = void 0;
const core_1 = require("@mikro-orm/core");
const CatalogProducts_1 = require("./CatalogProducts");
const CatalogProperties_1 = require("./CatalogProperties");
let ProductPropertyValues = class ProductPropertyValues {
};
exports.ProductPropertyValues = ProductPropertyValues;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProducts_1.CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true }),
    __metadata("design:type", CatalogProducts_1.CatalogProducts)
], ProductPropertyValues.prototype, "product", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProperties_1.CatalogProperties, fieldName: 'property', primary: true }),
    __metadata("design:type", CatalogProperties_1.CatalogProperties)
], ProductPropertyValues.prototype, "property", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'jsonb' }),
    __metadata("design:type", Object)
], ProductPropertyValues.prototype, "value", void 0);
exports.ProductPropertyValues = ProductPropertyValues = __decorate([
    (0, core_1.Entity)()
], ProductPropertyValues);
//# sourceMappingURL=ProductPropertyValues.js.map