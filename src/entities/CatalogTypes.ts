import { Collection, Entity, ManyToMany, ManyToOne, OneToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { Catalogs } from './Catalogs';

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

  @ManyToMany({ entity: () => CatalogProperties, pivotTable: 'property_in_types', joinColumn: 'type', inverseJoinColumn: 'property' })
  propertyInTypes = new Collection<CatalogProperties>(this);

}
