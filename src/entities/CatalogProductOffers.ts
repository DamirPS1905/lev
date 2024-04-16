import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
import { OfferAmounts } from './OfferAmounts';
import { OfferPrices } from './OfferPrices';
import { OfferPropertyValues } from './OfferPropertyValues';
import { OoRelationValues } from './OoRelationValues';
import { OpRelationValues } from './OpRelationValues';
import { PoRelationValues } from './PoRelationValues';
import { Stores } from './Stores';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, type Opt } from '@mikro-orm/core';

@Entity()
export class CatalogProductOffers {

  @PrimaryKey()
  id!: bigint;

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product' })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_product_offers_catalog_article_uind' })
  catalog!: Catalogs;

  @Property()
  article!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  created!: Date & Opt;

  @ManyToMany({ entity: () => Stores, pivotTable: 'offer_amounts', pivotEntity: () => OfferAmounts, joinColumn: 'offer', inverseJoinColumn: 'store' })
  offerAmounts = new Collection<Stores>(this);

	// gen - begin
	
	@OneToMany({ entity: () => OfferAmounts, mappedBy: 'offer' })
	offerAmountsByOffer = new Collection<OfferAmounts>(this);
	
	@OneToMany({ entity: () => OfferPrices, mappedBy: 'offer' })
	offerPricesByOffer = new Collection<OfferPrices>(this);
	
	@OneToMany({ entity: () => OfferPropertyValues, mappedBy: 'offer' })
	offerPropertyValuesByOffer = new Collection<OfferPropertyValues>(this);
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'target' })
	poRelationValuesByTarget = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'source' })
	opRelationValuesBySource = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'target' })
	ooRelationValuesByTarget = new Collection<OoRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'source' })
	ooRelationValuesBySource = new Collection<OoRelationValues>(this);
	
	// gen - end
}
