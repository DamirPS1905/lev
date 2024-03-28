import { Entity, ManyToOne, Opt, PrimaryKeyProp, Property } from '@mikro-orm/core';
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

  @Property({ columnType: 'numeric(10,0)' })
  rate!: string;

  @Property({ type: 'string', columnType: 'time(0)', defaultRaw: `CURRENT_TIMESTAMP` })
  updatedAt!: string & Opt;

}
