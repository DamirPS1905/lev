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
	
	@OneToMany({ entity: () => CatalogTypes, mappedBy: 'catalog' })
	catalogTypesByCatalog = new Collection<CatalogTypes>(this);
	
	@OneToMany({ entity: () => CatalogProducts, mappedBy: 'catalog' })
	catalogProductsByCatalog = new Collection<CatalogProducts>(this);
	
	@OneToMany({ entity: () => CatalogProductOffers, mappedBy: 'catalog' })
	catalogProductOffersByCatalog = new Collection<CatalogProductOffers>(this);
	
	@OneToMany({ entity: () => PropertyTypes, mappedBy: 'catalog' })
	propertyTypesByCatalog = new Collection<PropertyTypes>(this);
	
	@OneToMany({ entity: () => CatalogBrands, mappedBy: 'catalog' })
	catalogBrandsByCatalog = new Collection<CatalogBrands>(this);
	
	@OneToMany({ entity: () => CatalogProperties, mappedBy: 'catalog' })
	catalogPropertiesByCatalog = new Collection<CatalogProperties>(this);
	
	@OneToMany({ entity: () => CatalogMetatypeProperties, mappedBy: 'catalog' })
	catalogMetatypePropertiesByCatalog = new Collection<CatalogMetatypeProperties>(this);
	
	@OneToMany({ entity: () => ProductRelations, mappedBy: 'catalog' })
	productRelationsByCatalog = new Collection<ProductRelations>(this);
	
	// gen - end
}
