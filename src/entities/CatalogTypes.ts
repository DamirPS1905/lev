import { CatalogProducts } from './CatalogProducts';
import { CatalogTypesOverload } from './CatalogTypesOverload';
import { Catalogs } from './Catalogs';
import { PropertyInTypes } from './PropertyInTypes';
import { TypePropertyValues } from './TypePropertyValues';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Opt } from '@mikro-orm/core';

@Entity()
export class CatalogTypes {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'parent', nullable: true, unique: 'catalog_types_parent_title' })
  parent?: CatalogTypes;

  @Property({ type: 'boolean' })
  root: boolean & Opt = false;

  @Property({ columnType: 'smallint' })
  level!: number;



	// gen - begin
	
	@OneToMany({ entity: () => CatalogTypesOverload, mappedBy: 'child' })
	catalogTypesOverloadByChild = new Collection<CatalogTypesOverload>(this);
	
	@OneToMany({ entity: () => CatalogTypesOverload, mappedBy: 'parent' })
	catalogTypesOverloadByParent = new Collection<CatalogTypesOverload>(this);
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'type' })
	catalogProductsByType = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => PropertyInTypes, mappedBy: 'type' })
	propertyInTypesByType = new Collection<PropertyInTypes>(this);
	
	@OneToMany({ entity: () => TypePropertyValues, mappedBy: 'instance' })
	typePropertyValuesByInstance = new Collection<TypePropertyValues>(this);
	
	// gen - end

}
