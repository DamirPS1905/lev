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
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Opt } from '@mikro-orm/core';

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

	// gen - begin
	
	@OneToMany({ entity: () => CatalogProductOffers, mappedBy: 'product' })
	catalogProductOffersByProduct = new Collection<CatalogProductOffers>(this);
	
	@OneToMany({ entity: () => ProductPrices, mappedBy: 'product' })
	productPricesByProduct = new Collection<ProductPrices>(this);
	
	@OneToMany({ entity: () => ProductPropertyValues, mappedBy: 'product' })
	productPropertyValuesByProduct = new Collection<ProductPropertyValues>(this);
	
	@OneToMany({ entity: () => PoRelationValues, mappedBy: 'source' })
	poRelationValuesBySource = new Collection<PoRelationValues>(this);
	
	@OneToMany({ entity: () => OpRelationValues, mappedBy: 'target' })
	opRelationValuesByTarget = new Collection<OpRelationValues>(this);
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'target' })
	ppRelationValuesByTarget = new Collection<PpRelationValues>(this);
	
	@OneToMany({ entity: () => PpRelationValues, mappedBy: 'source' })
	ppRelationValuesBySource = new Collection<PpRelationValues>(this);
	
	// gen - end
}
