import { CatalogBrands } from './CatalogBrands';
import { CatalogMetatypeProperties } from './CatalogMetatypeProperties';
import { CatalogProductOffers } from './CatalogProductOffers';
import { CatalogProducts } from './CatalogProducts';
import { CatalogProperties } from './CatalogProperties';
import { CatalogTypes } from './CatalogTypes';
import { Companies } from './Companies';
import { ProductRelations } from './ProductRelations';
import { PropertyTypes } from './PropertyTypes';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden } from '@mikro-orm/core';

@Entity()
export class Catalogs {

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', hidden: true, unique: 'catalogs_company_title_uind' })
  company!: Companies & Hidden;

	// gen - begin
	
	@OneToMany({ entity: () => CatalogTypes, mappedBy: 'catalog', hidden: true })
	catalogTypesByCatalog: Collection<CatalogTypes> & Hidden = new Collection<CatalogTypes>(this);
	
	@OneToMany({ entity: () => CatalogBrands, mappedBy: 'catalog', hidden: true })
	catalogBrandsByCatalog: Collection<CatalogBrands> & Hidden = new Collection<CatalogBrands>(this);
	
	@OneToMany({ entity: () => PropertyTypes, mappedBy: 'catalog', hidden: true })
	propertyTypesByCatalog: Collection<PropertyTypes> & Hidden = new Collection<PropertyTypes>(this);
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'catalog', hidden: true })
	catalogProductsByCatalog: Collection<CatalogProducts> & Hidden = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => CatalogProductOffers, mappedBy: 'catalog', hidden: true })
	catalogProductOffersByCatalog: Collection<CatalogProductOffers> & Hidden = new Collection<CatalogProductOffers>(this);
	
	@OneToMany({ entity: () => CatalogProperties, mappedBy: 'catalog', hidden: true })
	catalogPropertiesByCatalog: Collection<CatalogProperties> & Hidden = new Collection<CatalogProperties>(this);
	
	@OneToMany({ entity: () => CatalogMetatypeProperties, mappedBy: 'catalog', hidden: true })
	catalogMetatypePropertiesByCatalog: Collection<CatalogMetatypeProperties> & Hidden = new Collection<CatalogMetatypeProperties>(this);
	
	@OneToMany({ entity: () => ProductRelations, mappedBy: 'catalog', hidden: true })
	productRelationsByCatalog: Collection<ProductRelations> & Hidden = new Collection<ProductRelations>(this);
	
	// gen - end
}
