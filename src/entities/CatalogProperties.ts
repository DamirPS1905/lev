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
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, type Hidden, type Opt } from '@mikro-orm/core';

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
	
	@OneToMany({ entity: () => OptionsPropertyValues, mappedBy: 'property', hidden: true })
	optionsPropertyValuesByProperty: Collection<OptionsPropertyValues> & Hidden = new Collection<OptionsPropertyValues>(this);
	
	@OneToMany({ entity: () => PropertyInTypes, mappedBy: 'property', hidden: true })
	propertyInTypesByProperty: Collection<PropertyInTypes> & Hidden = new Collection<PropertyInTypes>(this);
	
	@OneToMany({ entity: () => CatalogMetatypeProperties, mappedBy: 'property', hidden: true })
	catalogMetatypePropertiesByProperty: Collection<CatalogMetatypeProperties> & Hidden = new Collection<CatalogMetatypeProperties>(this);
	
	@OneToMany({ entity: () => BrandPropertyValues, mappedBy: 'property', hidden: true })
	brandPropertyValuesByProperty: Collection<BrandPropertyValues> & Hidden = new Collection<BrandPropertyValues>(this);
	
	@OneToMany({ entity: () => TypePropertyValues, mappedBy: 'property', hidden: true })
	typePropertyValuesByProperty: Collection<TypePropertyValues> & Hidden = new Collection<TypePropertyValues>(this);
	
	@OneToMany({ entity: () => ProductPropertyValues, mappedBy: 'property', hidden: true })
	productPropertyValuesByProperty: Collection<ProductPropertyValues> & Hidden = new Collection<ProductPropertyValues>(this);
	
	@OneToMany({ entity: () => OfferPropertyValues, mappedBy: 'property', hidden: true })
	offerPropertyValuesByProperty: Collection<OfferPropertyValues> & Hidden = new Collection<OfferPropertyValues>(this);
	
	@OneToMany({ entity: () => CollectionPropertyValues, mappedBy: 'property', hidden: true })
	collectionPropertyValuesByProperty: Collection<CollectionPropertyValues> & Hidden = new Collection<CollectionPropertyValues>(this);
	
	// gen - end
}
