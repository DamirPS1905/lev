import { Entity, Index, ManyToOne, type Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { Stores } from './Stores';

@Entity()
@Index({ name: 'offer_amounts_amount_changed_at_ind', properties: ['amount', 'changedAt'] })
export class OfferAmounts {

  [PrimaryKeyProp]?: ['offer', 'store'];

  @ManyToOne({ entity: () => CatalogProductOffers, fieldName: 'offer', deleteRule: 'cascade', primary: true })
  offer!: CatalogProductOffers;

  @ManyToOne({ entity: () => Stores, fieldName: 'store', primary: true })
  store!: Stores;

  @Property({ type: 'string', columnType: 'numeric(18,6)', defaultRaw: `0` })
  amount!: string & Opt;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  changedAt!: Date & Opt;

  @Index({ name: 'offer_amounts_version_ind' })
  @Property({ autoincrement: true })
  version!: bigint;

}
