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
	
	@OneToMany({ entity: () => Rates, mappedBy: 'to', hidden: true })
	ratesByTo: Collection<Rates> & Hidden = new Collection<Rates>(this);
	
	@OneToMany({ entity: () => Rates, mappedBy: 'from', hidden: true })
	ratesByFrom: Collection<Rates> & Hidden = new Collection<Rates>(this);
	
	@OneToMany({ entity: () => RatesSources, mappedBy: 'baseCurrency', hidden: true })
	ratesSourcesByBaseCurrency: Collection<RatesSources> & Hidden = new Collection<RatesSources>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'displayCurrency', hidden: true })
	priceTypesByDisplayCurrency: Collection<PriceTypes> & Hidden = new Collection<PriceTypes>(this);
	
	@OneToMany({ entity: () => PriceTypes, mappedBy: 'baseCurrency', hidden: true })
	priceTypesByBaseCurrency: Collection<PriceTypes> & Hidden = new Collection<PriceTypes>(this);
	
	// gen - end
}
