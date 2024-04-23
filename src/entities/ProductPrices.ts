import { Entity, Index, ManyToOne, type Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProducts } from './CatalogProducts';
import { PriceTypes } from './PriceTypes';

@Entity()
export class ProductPrices {

  [PrimaryKeyProp]?: ['product', 'priceType'];

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', deleteRule: 'cascade', primary: true })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => PriceTypes, fieldName: 'price_type', primary: true, index: 'product_prices_price_type_version_ind' })
  priceType!: PriceTypes;

  @Property({ columnType: 'numeric(18,2)' })
  value!: string;

  @Property()
  currency!: number;

  @Property({ type: 'string', columnType: 'numeric(18,2)', defaultRaw: `0` })
  lastChange!: string & Opt;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: Date & Opt;

  @Index({ name: 'product_prices_index_ind' })
  @Property({ columnType: 'numeric(18,2)' })
  index!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  changedAt!: Date & Opt;

  @Property({ type: 'boolean' })
  deleted: boolean & Opt = false;

  @Property({ autoincrement: true })
  version!: bigint;

}
