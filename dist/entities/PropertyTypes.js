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
exports.PropertyTypes = void 0;
const CatalogProperties_1 = require("./CatalogProperties");
const Catalogs_1 = require("./Catalogs");
const PropertyValues_1 = require("./PropertyValues");
const core_1 = require("@mikro-orm/core");
let PropertyTypes = class PropertyTypes {
    constructor() {
        // gen - begin
        this.catalogPropertiesByType = new core_1.Collection(this);
        this.propertyValuesByType = new core_1.Collection(this);
        // gen - end
    }
};
exports.PropertyTypes = PropertyTypes;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], PropertyTypes.prototype, "id", void 0);
__decorate([
    (0, core_1.Unique)({ name: 'property_types_common_title_uind' }),
    (0, core_1.Property)(),
    __metadata("design:type", String)
], PropertyTypes.prototype, "title", void 0);
__decorate([
    (0, core_1.Property)({ columnType: 'jsonb' }),
    __metadata("design:type", Object)
], PropertyTypes.prototype, "scheme", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Catalogs_1.Catalogs, fieldName: 'catalog', nullable: true, unique: 'property_types_catalog_title_uind' }),
    __metadata("design:type", Catalogs_1.Catalogs)
], PropertyTypes.prototype, "catalog", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => CatalogProperties_1.CatalogProperties, mappedBy: 'type', hidden: true }),
    __metadata("design:type", Object)
], PropertyTypes.prototype, "catalogPropertiesByType", void 0);
__decorate([
    (0, core_1.OneToMany)({ entity: () => PropertyValues_1.PropertyValues, mappedBy: 'type', hidden: true }),
    __metadata("design:type", Object)
], PropertyTypes.prototype, "propertyValuesByType", void 0);
exports.PropertyTypes = PropertyTypes = __decorate([
    (0, core_1.Entity)(),
    (0, core_1.Unique)({ name: 'property_types_common_title_uind', expression: 'CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (title) WHERE (catalog IS NULL)' })
], PropertyTypes);
//# sourceMappingURL=PropertyTypes.js.map