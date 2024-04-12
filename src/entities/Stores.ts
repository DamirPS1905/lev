import { Collection, Entity, type Hidden, ManyToMany, OneToMany, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogProductOffers } from './CatalogProductOffers';
import { Companies } from './Companies';
import { OfferAmounts } from './OfferAmounts';

@Entity()
export class Stores {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'stores_company_title_uind' })
  company!: Companies & Hidden;

  @Property()
  title!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLat?: string;

  @Property({ columnType: 'numeric(10,0)', nullable: true })
  geoLong?: string;

  @ManyToMany({ entity: () => CatalogProductOffers, mappedBy: 'offerAmounts' })
  offerAmountsInverse = new Collection<CatalogProductOffers>(this);

  @OneToMany({ entity: () => OfferAmounts, mappedBy: 'store' })
  storeInverse = new Collection<OfferAmounts>(this);

}
