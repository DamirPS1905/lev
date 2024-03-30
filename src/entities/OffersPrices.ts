import { Entity, ManyToOne, Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { PriceTypes } from './PriceTypes';

@Entity()
export class OffersPrices {

  [PrimaryKeyProp]?: ['offer', 'priceType'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => PriceTypes, fieldName: 'price_type', primary: true })
  priceType!: PriceTypes;

  @Property({ columnType: 'numeric(18,2)' })
  value!: string;

  @Property()
  currency!: number;

  @Property({ type: 'unknown', columnType: 'timetz(6)', defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: unknown & Opt;

  @Property({ type: 'string', columnType: 'numeric(10,0)', defaultRaw: `0` })
  lastChange!: string & Opt;

}
