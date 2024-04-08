import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogBrands } from './CatalogBrands';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class BrandPropertyValues {

  [PrimaryKeyProp]?: ['instance', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogBrands, fieldName: 'instance', deleteRule: 'cascade', primary: true })
  instance!: CatalogBrands;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @Property()
  value!: bigint;

}
