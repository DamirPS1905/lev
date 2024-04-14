import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class ProductPropertyValues {

  [PrimaryKeyProp]?: ['product', 'property', 'order'];

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @Property()
  value!: bigint;

}
