import { Currencies } from './Currencies';
import { Rates } from './Rates';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Unique, type Hidden, type Opt } from '@mikro-orm/core';

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

	// gen - begin
	
	@OneToMany({ entity: () => Rates, mappedBy: 'source' })
	ratesBySource = new Collection<Rates>(this);
	
	// gen - end
}
