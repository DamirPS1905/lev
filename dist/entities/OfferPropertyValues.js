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
exports.OfferPropertyValues = void 0;
const core_1 = require("@mikro-orm/core");
const CatalogProductOffers_1 = require("./CatalogProductOffers");
const CatalogProperties_1 = require("./CatalogProperties");
let OfferPropertyValues = class OfferPropertyValues {
};
exports.OfferPropertyValues = OfferPropertyValues;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProductOffers_1.CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true }),
    __metadata("design:type", CatalogProductOffers_1.CatalogProductOffers)
], OfferPropertyValues.prototype, "offer", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogProperties_1.CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true }),
    __metadata("design:type", CatalogProperties_1.CatalogProperties)
], OfferPropertyValues.prototype, "property", void 0);
__decorate([
    (0, core_1.PrimaryKey)({ columnType: 'smallint' }),
    __metadata("design:type", Number)
], OfferPropertyValues.prototype, "order", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", typeof BigInt === "function" ? BigInt : Object)
], OfferPropertyValues.prototype, "value", void 0);
exports.OfferPropertyValues = OfferPropertyValues = __decorate([
    (0, core_1.Entity)()
], OfferPropertyValues);
//# sourceMappingURL=OfferPropertyValues.js.map