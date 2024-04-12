import { Collection, Entity, type Hidden, OneToMany, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { PriceTypes } from './PriceTypes';
import { Rates } from './Rates';
import { RatesSources } from './RatesSources';

@Entity()
export class Currencies {

  @PrimaryKey({ columnType: 'smallint' })
  id!: number;

  @Unique({ name: 'currencies_key_uind' })
  @Property()
  key!: string;

  @Unique({ name: 'currencies_title_uind' })
  @Property()
  title!: string;

  @Property({ type: 'string', hidden: true })
  symbol: string & Hidden & Opt = '';

  @Property({ type: 'number', hidden: true })
  precision: number & Hidden & Opt = 4;

  @Property({ type: 'string', nullable: true, hidden: true })
  icon?: string & Hidden;

  @OneToMany({ entity: () => PriceTypes, mappedBy: 'displayCurrency' })
  displayCurrencyInverse = new Collection<PriceTypes>(this);

  @OneToMany({ entity: () => RatesSources, mappedBy: 'baseCurrency' })
  baseCurrencyInverse = new Collection<RatesSources>(this);

  @OneToMany({ entity: () => Rates, mappedBy: 'from' })
  fromInverse = new Collection<Rates>(this);

  @OneToMany({ entity: () => Rates, mappedBy: 'to' })
  toInverse = new Collection<Rates>(this);

}
