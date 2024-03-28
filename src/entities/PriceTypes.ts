import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Currencies } from './Currencies';

@Entity()
@Unique({ name: 'price_types_company_title_uind', properties: ['company', 'title'] })
export class PriceTypes {

  @PrimaryKey()
  id!: number;

  @Property()
  company!: number;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Currencies, fieldName: 'display_currency', deleteRule: 'set null', nullable: true })
  displayCurrency?: Currencies;

}
