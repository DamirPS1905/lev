import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';

@Entity()
export class OptionsPropertyValues {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', unique: 'options_property_values_property_hash_uind' })
  property!: CatalogProperties;

  @Property({ columnType: 'jsonb' })
  value!: any;

  @Property({ length: 48, nullable: true })
  hash?: string;

}
