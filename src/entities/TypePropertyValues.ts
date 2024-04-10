import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { CatalogTypes } from './CatalogTypes';

@Entity()
export class TypePropertyValues {

  [PrimaryKeyProp]?: ['instance', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'instance', deleteRule: 'cascade', primary: true })
  instance!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @Property()
  value!: bigint;

}
