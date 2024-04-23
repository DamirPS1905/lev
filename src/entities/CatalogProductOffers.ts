import { CatalogProducts } from './CatalogProducts';
import { Catalogs } from './Catalogs';
import { OfferAmounts } from './OfferAmounts';
import { OfferPrices } from './OfferPrices';
import { OfferPropertyValues } from './OfferPropertyValues';
import { OoRelationValues } from './OoRelationValues';
import { OpRelationValues } from './OpRelationValues';
import { PoRelationValues } from './PoRelationValues';
import { Stores } from './Stores';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden, type Opt } from '@mikro-orm/core';

@Entity()
export class CatalogProductOffers {

  @PrimaryKey()
  id!: bigint;

  @ManyToOne({ entity: () => CatalogProducts, fieldName: 'product', unique: 'catalog_product_offers_product_article_uind' })
  product!: CatalogProducts;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_product_offers_catalog_article_uind' })
  catalog!: Catalogs;

  @Property({ nullable: true })
  article?: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  created!: Date & Opt;

  @Property({ nullable: true })
  image?: string;

  @ManyToMany({ entity: () => Stores, pivotTable: 'offer_amounts', pivotEntity: () => OfferAmounts, joinColumn: 'offer', inverseJoinColumn: 'store', fixedOrder: true, fixedOrderColumn: 'version', hidden: true })
  offerAmounts: Collection<Stores> & Hidden = new Collection<Stores>(this);

	// gen - begin
	
	@OneToMany({ entity: () => OfferPrices, mappedBy: 'offer', hidden: true })
	offerPricesByOffer: Collection<OfferPrices> & Hidden = new Collection<OfferPrices>(this);
	
	@OneToMany({ entity: () => OfferAmounts, mappedBy: 'offer', hidden: true })
	offerAmountsByOffer: Collection<OfferAmounts> & Hidden = new Collection<OfferAmounts>(this);
	
	@OneToMany({ entity: () => OfferPropertyValues, mappedBy: 'offer', hidden: true })
	offerPropertyValuesByOffer: Collection<OfferPropertyValues> & Hidden = new Collection<OfferPropertyValues>(this);
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'target', hidden: true })
	poRelationValuesByTarget: Collection<PoRelationValues> & Hidden = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'source', hidden: true })
	opRelationValuesBySource: Collection<OpRelationValues> & Hidden = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'target', hidden: true })
	ooRelationValuesByTarget: Collection<OoRelationValues> & Hidden = new Collection<OoRelationValues>(this);
	
	@OneToMany({ entity: () => OoRelationValues, mappedBy: 'source', hidden: true })
	ooRelationValuesBySource: Collection<OoRelationValues> & Hidden = new Collection<OoRelationValues>(this);
	
	// gen - end
}
