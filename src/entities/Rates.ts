import { Entity, ManyToOne, type Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Currencies } from './Currencies';
import { RatesSources } from './RatesSources';

@Entity()
export class Rates {

  [PrimaryKeyProp]?: ['from', 'to', 'source'];

  @ManyToOne({ entity: () => Currencies, fieldName: 'from', deleteRule: 'cascade', primary: true })
  from!: Currencies;

  @ManyToOne({ entity: () => Currencies, fieldName: 'to', deleteRule: 'cascade', primary: true })
  to!: Currencies;

  @ManyToOne({ entity: () => RatesSources, fieldName: 'source', primary: true })
  source!: RatesSources;

  @Property({ columnType: 'numeric(18,9)' })
  rate!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: Date & Opt;

}
