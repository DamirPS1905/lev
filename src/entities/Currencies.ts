import { PriceTypes } from './PriceTypes';
import { Rates } from './Rates';
import { RatesSources } from './RatesSources';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique, type Hidden, type Opt } from '@mikro-orm/core';

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

	// gen - begin
	
	@OneToMany({ entity: () => Rates, mappedBy: 'to' })
	ratesByTo = new Collection<Rates>(this);
	
	@OneToMany({ entity: () => Rates, mappedBy: 'from' })
	ratesByFrom = new Collection<Rates>(this);
	
	@OneToMany({ entity: () => RatesSources, mappedBy: 'baseCurrency' })
	ratesSourcesByBaseCurrency = new Collection<RatesSources>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'displayCurrency' })
	priceTypesByDisplayCurrency = new Collection<PriceTypes>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'baseCurrency' })
	priceTypesByBaseCurrency = new Collection<PriceTypes>(this);
	
	// gen - end
}
