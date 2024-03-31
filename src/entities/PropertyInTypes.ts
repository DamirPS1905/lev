import { Entity, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { CatalogProperties } from './CatalogProperties';
import { CatalogTypes } from './CatalogTypes';

@Entity()
@Unique({ name: 'property_in_types_type_order_uind', expression: 'CREATE UNIQUE INDEX property_in_types_type_order_uind ON public.property_in_types USING btree (type, "order")' })
export class PropertyInTypes {

  [PrimaryKeyProp]?: ['type', 'property'];

  @ManyToOne({ entity: () => CatalogTypes, fieldName: 'type', deleteRule: 'cascade', primary: true })
  type!: CatalogTypes;

  @ManyToOne({ entity: () => CatalogProperties, fieldName: 'property', deleteRule: 'cascade', primary: true })
  property!: CatalogProperties;

  @Property({ columnType: 'smallint' })
  order!: number;

}
