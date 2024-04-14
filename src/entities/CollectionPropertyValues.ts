import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogBrandCollections } from './CatalogBrandCollections';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class CollectionPropertyValues {

  [PrimaryKeyProp]?: ['instance', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogBrandCollections, fieldName: 'instance', deleteRule: 'cascade', primary: true })
  instance!: CatalogBrandCollections;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @Property()
  value!: bigint;

}
