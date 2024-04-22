import { Entity, type Hidden, Index, ManyToOne, type Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { PriceTypes } from './PriceTypes';

@Entity()
export class OfferPrices {

  [PrimaryKeyProp]?: ['offer', 'priceType'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => PriceTypes, fieldName: 'price_type', deleteRule: 'cascade', primary: true })
  priceType!: PriceTypes;

  @Property({ columnType: 'numeric(18,2)' })
  value!: string;

  @Property()
  currency!: number;

  @Property({ type: 'string', columnType: 'numeric(18,2)', defaultRaw: `0` })
  lastChange!: string & Opt;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: Date & Opt;

  @Index({ name: 'offer_prices_index_ind' })
  @Property({ columnType: 'numeric(18,2)' })
  index!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  changedAt!: Date & Opt;

  @Property({ type: 'boolean', hidden: true })
  deleted: boolean & Hidden & Opt = false;

}
