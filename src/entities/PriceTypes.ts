import { Companies } from './Companies';
import { Currencies } from './Currencies';
import { OfferPrices } from './OfferPrices';
import { ProductPrices } from './ProductPrices';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

@Entity()
export class PriceTypes {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'price_types_company_title_uind' })
  company!: Companies & Hidden;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Currencies, fieldName: 'display_currency', deleteRule: 'set null', nullable: true })
  displayCurrency?: Currencies;

  @ManyToOne({ entity: () => Currencies, fieldName: 'base_currency' })
  baseCurrency!: Currencies;

	// gen - begin
	
	@OneToMany({ entity: () => OfferPrices, mappedBy: 'priceType' })
	offerPricesByPriceType = new Collection<OfferPrices>(this);
	
	@OneToMany({ entity: () => ProductPrices, mappedBy: 'priceType' })
	productPricesByPriceType = new Collection<ProductPrices>(this);
	
	// gen - end

}
