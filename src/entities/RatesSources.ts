import { Entity, type Hidden, ManyToOne, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Currencies } from './Currencies';

@Entity()
export class RatesSources {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'rates_sources_title_uind' })
  @Property()
  title!: string;

  @ManyToOne({ entity: () => Currencies, fieldName: 'base_currency' })
  baseCurrency!: Currencies;

  @Property({ type: 'string' })
  timezone: string & Opt = 'UTC';

  @Property({ type: 'boolean' })
  fine: boolean & Opt = false;

  @Property({ type: 'Date', length: 6, hidden: true, defaultRaw: `CURRENT_TIMESTAMP` })
  fineAt!: Date & Hidden & Opt;

  @Property({ type: 'string', columnType: 'text', nullable: true, hidden: true })
  problemInfo?: string & Hidden;

}
