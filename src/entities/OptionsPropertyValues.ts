import { Entity, OneToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { PropertyValues } from './PropertyValues';

@Entity()
export class OptionsPropertyValues {

  [PrimaryKeyProp]?: 'value';

  @OneToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', unique: 'options_property_values_property_hash_uind' })
  property!: CatalogProperties;

  @OneToOne({ entity: () => PropertyValues, fieldName: 'value', deleteRule: 'cascade', primary: true })
  value!: PropertyValues;

  @Property({ length: 48, nullable: true })
  hash?: string;

}
