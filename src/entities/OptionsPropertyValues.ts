import { Entity, type Hidden, ManyToOne, OneToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { PropertyValues } from './PropertyValues';

@Entity()
export class OptionsPropertyValues {

  [PrimaryKeyProp]?: 'value';

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', unique: 'options_property_values_property_hash_uind' })
  property!: CatalogProperties;

  @OneToOne({ entity: () => PropertyValues, fieldName: 'value', deleteRule: 'cascade', primary: true })
  value!: PropertyValues;

  @Property({ type: 'string', length: 48, nullable: true, hidden: true })
  hash?: string & Hidden;

}
