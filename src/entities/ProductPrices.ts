import { Entity, ManyToOne, Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { PriceTypes } from './PriceTypes';

@Entity()
export class ProductPrices {

  [PrimaryKeyProp]?: ['product', 'priceType'];

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => PriceTypes, fieldName: 'price_type', primary: true })
  priceType!: PriceTypes;

  @Property({ columnType: 'numeric(10,0)' })
  value!: string;

  @Property()
  currency!: number;

  @Property({ type: 'unknown', columnType: 'timetz(6)', defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: unknown & Opt;

  @Property({ type: 'string', columnType: 'numeric(10,0)', defaultRaw: `0` })
  lastChange!: string & Opt;

}
