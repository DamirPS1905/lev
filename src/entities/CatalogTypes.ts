import { Collection, Entity, ManyToOne, OneToMany, OneToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogTypesOverload } from './CatalogTypesOverload';
import { Catalogs } from './Catalogs';
import { PropertyInTypes } from './PropertyInTypes';
import { TypePropertyValues } from './TypePropertyValues';

@Entity()
export class CatalogTypes {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @OneToOne({ entity: () => CatalogTypes, fieldName: 'parent', nullable: true, unique: 'catalog_types_parent_title' })
  parent?: CatalogTypes;

  @Property({ type: 'boolean' })
  root: boolean & Opt = false;

  @Property({ columnType: 'smallint' })
  level!: number;

  @OneToMany({ entity: () => PropertyInTypes, mappedBy: 'type' })
  typeInverse = new Collection<PropertyInTypes>(this);

  @OneToMany({ entity: () => CatalogTypesOverload, mappedBy: 'parent' })
  parentInverse = new Collection<CatalogTypesOverload>(this);

  @OneToMany({ entity: () => CatalogTypesOverload, mappedBy: 'child' })
  childInverse = new Collection<CatalogTypesOverload>(this);

  @OneToMany({ entity: () => TypePropertyValues, mappedBy: 'instance' })
  instanceInverse = new Collection<TypePropertyValues>(this);

}
