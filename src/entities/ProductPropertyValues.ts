import { Entity, Index, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class ProductPropertyValues {

  [PrimaryKeyProp]?: ['product', 'property'];

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', primary: true })
  property!: CatalogProperties;

  @Index({ name: 'product_property_values_keys_ind' })
  @Property()
  valueKey!: bigint;

}
