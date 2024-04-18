import { Companies } from './Companies';
import { OfferAmounts } from './OfferAmounts';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

@Entity()
export class Stores {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'stores_company_title_uind' })
  company!: Companies & Hidden;

  @Property()
  title!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLat?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLong?: string;

	// gen - begin
	
	@OneToMany({ entity: () => OfferAmounts, mappedBy: 'store', hidden: true })
	offerAmountsByStore: Collection<OfferAmounts> & Hidden = new Collection<OfferAmounts>(this);
	
	// gen - end
}
