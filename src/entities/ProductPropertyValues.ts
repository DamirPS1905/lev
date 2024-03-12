import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class ProductPropertyValues {

  [PrimaryKeyProp]?: ['product', 'property'];

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', primary: true })
  property!: CatalogProperties;

  @Property({ columnType: 'jsonb' })
  value!: any;

}
