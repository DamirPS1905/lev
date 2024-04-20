import { CatalogBrandCollections } from './CatalogBrandCollections';
import { CatalogBrands } from './CatalogBrands';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogTypes } from './CatalogTypes';
import { Catalogs } from './Catalogs';
import { OpRelationValues } from './OpRelationValues';
import { PoRelationValues } from './PoRelationValues';
import { PpRelationValues } from './PpRelationValues';
import { ProductPrices } from './ProductPrices';
import { ProductPropertyValues } from './ProductPropertyValues';
import { Units } from './Units';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden, type Opt } from '@mikro-orm/core';

@Entity()
export class CatalogProducts {

  @PrimaryKey()
  id!: bigint;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_products_catalog_title_uind' })
  catalog!: Catalogs;

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'type' })
  type!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogBrands, fieldName: 'brand' })
  brand!: CatalogBrands;

  @Property()
  title!: string;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  created!: Date & Opt;

  @ManyToOne({ entity: () => CatalogBrandCollections, fieldName: 'collection', deleteRule: 'set null', nullable: true })
  collection?: CatalogBrandCollections;

  @Property({ type: 'number', columnType: 'smallint' })
  offersCount: number & Opt = 0;

  @ManyToOne({ entity: () => Units, fieldName: 'accounting_unit' })
  accountingUnit!: Units;

  @Property({ nullable: true })
  image?: string;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogProductOffers, mappedBy: 'product', hidden: true })
	catalogProductOffersByProduct: Collection<CatalogProductOffers> & Hidden = new Collection<CatalogProductOffers>(this);
	
	@OneToMany({ entity: () => ProductPrices, mappedBy: 'product', hidden: true })
	productPricesByProduct: Collection<ProductPrices> & Hidden = new Collection<ProductPrices>(this);
	
	@OneToMany({ entity: () => ProductPropertyValues, mappedBy: 'product', hidden: true })
	productPropertyValuesByProduct: Collection<ProductPropertyValues> & Hidden = new Collection<ProductPropertyValues>(this);
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'source', hidden: true })
	poRelationValuesBySource: Collection<PoRelationValues> & Hidden = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'target', hidden: true })
	opRelationValuesByTarget: Collection<OpRelationValues> & Hidden = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'target', hidden: true })
	ppRelationValuesByTarget: Collection<PpRelationValues> & Hidden = new Collection<PpRelationValues>(this);
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'source', hidden: true })
	ppRelationValuesBySource: Collection<PpRelationValues> & Hidden = new Collection<PpRelationValues>(this);
	
	// gen - end
}
