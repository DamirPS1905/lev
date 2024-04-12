import { Collection, Entity, type Hidden, ManyToOne, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';
import { Currencies } from './Currencies';
import { ProductPrices } from './ProductPrices';

@Entity()
export class PriceTypes {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'price_types_company_title_uind' })
  company!: Companies & Hidden;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Currencies, fieldName: 'display_currency', deleteRule: 'set null', nullable: true })
  displayCurrency?: Currencies;

  @ManyToOne({ entity: () => Currencies, fieldName: 'base_currency' })
  baseCurrency!: Currencies;

  @OneToMany({ entity: () => ProductPrices, mappedBy: 'priceType' })
  priceTypeInverse = new Collection<ProductPrices>(this);

}
