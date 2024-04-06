import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Catalogs } from './Catalogs';

@Entity()
@Unique({ name: 'property_types_common_title_uind', expression: 'CREATE UNIQUE INDEX property_types_common_title_uind ON public.property_types USING btree (title) WHERE (catalog IS NULL)' })
export class PropertyTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'property_types_common_title_uind' })
  @Property()
  title!: string;

  @Property({ columnType: 'jsonb' })
  scheme!: any;

  @OneToOne({ entity: () => Catalogs, fieldName: 'catalog', nullable: true, unique: 'property_types_catalog_title_uind' })
  catalog?: Catalogs;

}
