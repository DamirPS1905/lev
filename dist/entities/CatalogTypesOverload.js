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
exports.CatalogTypesOverload = void 0;
const core_1 = require("@mikro-orm/core");
const CatalogTypes_1 = require("./CatalogTypes");
let CatalogTypesOverload = class CatalogTypesOverload {
};
exports.CatalogTypesOverload = CatalogTypesOverload;
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogTypes_1.CatalogTypes, fieldName: 'parent', deleteRule: 'cascade', primary: true }),
    __metadata("design:type", CatalogTypes_1.CatalogTypes)
], CatalogTypesOverload.prototype, "parent", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogTypes_1.CatalogTypes, fieldName: 'child', deleteRule: 'cascade', primary: true }),
    __metadata("design:type", CatalogTypes_1.CatalogTypes)
], CatalogTypesOverload.prototype, "child", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'smallint' }),
    __metadata("design:type", Number)
], CatalogTypesOverload.prototype, "delta", void 0);
exports.CatalogTypesOverload = CatalogTypesOverload = __decorate([
    (0, core_1.Entity)()
], CatalogTypesOverload);
//# sourceMappingURL=CatalogTypesOverload.js.map