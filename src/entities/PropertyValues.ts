import { Entity, Index, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { PropertyTypes } from './PropertyTypes';

@Entity()
@Index({ name: 'property_values_1_value', expression: 'CREATE INDEX property_values_1_value ON public.property_values USING btree ((((value ->> \'value\'::text))::character varying)) WHERE (type = 1)' })
@Index({ name: 'property_values_6_value', expression: 'CREATE INDEX property_values_6_value ON public.property_values USING btree ((((value ->> \'value\'::text))::integer)) WHERE (type = 6)' })
@Index({ name: 'property_values_7_value', expression: 'CREATE INDEX property_values_7_value ON public.property_values USING btree ((((value ->> \'value\'::text))::double precision)) WHERE (type = 7)' })
export class PropertyValues {

  [PrimaryKeyProp]?: 'valueKey';

  @PrimaryKey({ autoincrement: false })
  valueKey!: bigint;

  @ManyToOne({ entity: () => PropertyTypes, fieldName: 'type' })
  type!: PropertyTypes;

  @Property({ columnType: 'jsonb' })
  value!: any;

}
