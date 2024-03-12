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
exports.OptionsPropertyValues = void 0;
const core_1 = require("@mikro-orm/core");
const CatalogProperties_1 = require("./CatalogProperties");
let OptionsPropertyValues = class OptionsPropertyValues {
};
exports.OptionsPropertyValues = OptionsPropertyValues;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], OptionsPropertyValues.prototype, "id", void 0);
__decorate([
    (0, core_1.OneToOne)({ entity: () => CatalogProperties_1.CatalogProperties, fieldName: 'property', deleteRule: 'cascade', unique: 'options_property_values_property_hash_uind' }),
    __metadata("design:type", CatalogProperties_1.CatalogProperties)
], OptionsPropertyValues.prototype, "property", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'jsonb' }),
    __metadata("design:type", Object)
], OptionsPropertyValues.prototype, "value", void 0);
__decorate([
    (0, core_1.Property)({ length: 48, nullable: true }),
    __metadata("design:type", String)
], OptionsPropertyValues.prototype, "hash", void 0);
exports.OptionsPropertyValues = OptionsPropertyValues = __decorate([
    (0, core_1.Entity)()
], OptionsPropertyValues);
//# sourceMappingURL=OptionsPropertyValues.js.map