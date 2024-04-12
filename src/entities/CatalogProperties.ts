import { Collection, Entity, ManyToOne, OneToMany, OneToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';
import { PropertyTypes } from './PropertyTypes';
import { TypePropertyValues } from './TypePropertyValues';

@Entity()
export class CatalogProperties {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_properties_catalog_title_uind' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => PropertyTypes, fieldName: 'type' })
  type!: PropertyTypes;

  @Property({ type: 'boolean' })
  multiple: boolean & Opt = false;

  @Property({ type: 'boolean' })
  options: boolean & Opt = false;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

  @OneToMany({ entity: () => TypePropertyValues, mappedBy: 'property' })
  propertyInverse = new Collection<TypePropertyValues>(this);

}
