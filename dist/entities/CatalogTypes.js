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
exports.CatalogTypes = void 0;
const CatalogProducts_1 = require("./CatalogProducts");
const CatalogTypesOverload_1 = require("./CatalogTypesOverload");
const Catalogs_1 = require("./Catalogs");
const PropertyInTypes_1 = require("./PropertyInTypes");
const TypePropertyValues_1 = require("./TypePropertyValues");
const core_1 = require("@mikro-orm/core");
let CatalogTypes = class CatalogTypes {
    constructor() {
        this.root = false;
        // gen - begin
        this.catalogTypesOverloadByChild = new core_1.Collection(this);
        this.catalogTypesOverloadByParent = new core_1.Collection(this);
        this.catalogProductsByType = new core_1.Collection(this);
        this.propertyInTypesByType = new core_1.Collection(this);
        this.typePropertyValuesByInstance = new core_1.Collection(this);
        // gen - end
    }
};
exports.CatalogTypes = CatalogTypes;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], CatalogTypes.prototype, "id", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], CatalogTypes.prototype, "catalog", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], CatalogTypes.prototype, "title", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => CatalogTypes, fieldName: 'parent', nullable: true, unique: 'catalog_types_parent_title' }),
    __metadata("design:type", CatalogTypes)
], CatalogTypes.prototype, "parent", void 0);
__decorate([
    (0, core_1.Property)({ type: 'boolean' }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "root", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'smallint' }),
    __metadata("design:type", Number)
], CatalogTypes.prototype, "level", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogTypesOverload_1.CatalogTypesOverload, mappedBy: 'child', hidden: true }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "catalogTypesOverloadByChild", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogTypesOverload_1.CatalogTypesOverload, mappedBy: 'parent', hidden: true }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "catalogTypesOverloadByParent", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProducts_1.CatalogProducts, mappedBy: 'type', hidden: true }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "catalogProductsByType", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PropertyInTypes_1.PropertyInTypes, mappedBy: 'type', hidden: true }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "propertyInTypesByType", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => TypePropertyValues_1.TypePropertyValues, mappedBy: 'instance', hidden: true }),
    __metadata("design:type", Object)
], CatalogTypes.prototype, "typePropertyValuesByInstance", void 0);
exports.CatalogTypes = CatalogTypes = __decorate([
    (0, core_1.Entity)()
], CatalogTypes);
//# sourceMappingURL=CatalogTypes.js.map