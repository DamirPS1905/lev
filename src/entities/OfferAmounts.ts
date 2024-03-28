import { Entity, ManyToOne, Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { Stores } from './Stores';

@Entity()
export class OfferAmounts {

  [PrimaryKeyProp]?: ['offer', 'store'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => Stores, fieldName: 'store', primary: true })
  store!: Stores;

  @Property({ type: 'string', columnType: 'numeric(10,0)', defaultRaw: `0` })
  amount!: string & Opt;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  changedAt!: Date & Opt;

}
