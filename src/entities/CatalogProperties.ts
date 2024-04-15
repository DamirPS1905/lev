import { BrandPropertyValues } from './BrandPropertyValues';
import { CatalogMetatypeProperties } from './CatalogMetatypeProperties';
import { Catalogs } from './Catalogs';
import { CollectionPropertyValues } from './CollectionPropertyValues';
import { OfferPropertyValues } from './OfferPropertyValues';
import { OptionsPropertyValues } from './OptionsPropertyValues';
import { ProductPropertyValues } from './ProductPropertyValues';
import { PropertyInTypes } from './PropertyInTypes';
import { PropertyTypes } from './PropertyTypes';
import { TypePropertyValues } from './TypePropertyValues';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Opt } from '@mikro-orm/core';

@Entity()
export class CatalogProperties {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => Catalogs, fieldName: 'catalog', unique: 'catalog_properties_catalog_title_uind' })
  catalog!: Catalogs;

  @Property()
  title!: string;

  @ManyToOne({ entity: () => PropertyTypes, fieldName: 'type' })
  type!: PropertyTypes;

  @Property({ type: 'boolean' })
  multiple: boolean & Opt = false;

  @Property({ type: 'boolean' })
  options: boolean & Opt = false;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

	// gen - begin
	
	@OneToMany({ entity: () => OptionsPropertyValues, mappedBy: 'property' })
	optionsPropertyValuesByProperty = new Collection<OptionsPropertyValues>(this);
	
	@OneToMany({ entity: () => PropertyInTypes, mappedBy: 'property' })
	propertyInTypesByProperty = new Collection<PropertyInTypes>(this);
	
	@OneToMany({ entity: () => CatalogMetatypeProperties, mappedBy: 'property' })
	catalogMetatypePropertiesByProperty = new Collection<CatalogMetatypeProperties>(this);
	
	@OneToMany({ entity: () => BrandPropertyValues, mappedBy: 'property' })
	brandPropertyValuesByProperty = new Collection<BrandPropertyValues>(this);
	
	@OneToMany({ entity: () => TypePropertyValues, mappedBy: 'property' })
	typePropertyValuesByProperty = new Collection<TypePropertyValues>(this);
	
	@OneToMany({ entity: () => ProductPropertyValues, mappedBy: 'property' })
	productPropertyValuesByProperty = new Collection<ProductPropertyValues>(this);
	
	@OneToMany({ entity: () => OfferPropertyValues, mappedBy: 'property' })
	offerPropertyValuesByProperty = new Collection<OfferPropertyValues>(this);
	
	@OneToMany({ entity: () => CollectionPropertyValues, mappedBy: 'property' })
	collectionPropertyValuesByProperty = new Collection<CollectionPropertyValues>(this);
	
	// gen - end
}
