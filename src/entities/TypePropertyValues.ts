import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { CatalogTypes } from './CatalogTypes';

@Entity()
export class TypePropertyValues {

  [PrimaryKeyProp]?: ['type', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'type', deleteRule: 'cascade', primary: true })
  type!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @Property()
  value!: bigint;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

}
