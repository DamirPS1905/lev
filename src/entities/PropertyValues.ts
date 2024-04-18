import { OptionsPropertyValues } from './OptionsPropertyValues';
import { PropertyTypes } from './PropertyTypes';
import { Collection, Entity, Index, ManyToOne, OneToOne, PrimaryKey, PrimaryKeyProp, Property, type Hidden } from '@mikro-orm/core';

@Entity()
@Index({ name: 'property_values_1_value', expression: 'CREATE INDEX property_values_1_value ON public.property_values USING btree ((((value ->> \'value\'::text))::character varying)) WHERE (type = 1)' })
@Index({ name: 'property_values_2_value', expression: 'CREATE INDEX property_values_2_value ON public.property_values USING btree ((((value ->> \'value\'::text))::boolean)) WHERE (type = 2)' })
@Index({ name: 'property_values_6_value', expression: 'CREATE INDEX property_values_6_value ON public.property_values USING btree ((((value ->> \'valueIndex\'::text))::integer)) WHERE (type = 6)' })
@Index({ name: 'property_values_7_value', expression: 'CREATE INDEX property_values_7_value ON public.property_values USING btree ((((value ->> \'valueIndex\'::text))::double precision)) WHERE (type = 7)' })
export class PropertyValues {

  [PrimaryKeyProp]?: 'valueKey';

  @PrimaryKey({ autoincrement: false })
  valueKey!: bigint;

  @ManyToOne({ entity: () => PropertyTypes, fieldName: 'type', hidden: true })
  type!: PropertyTypes & Hidden;

  @Property({ columnType: 'jsonb' })
  value!: any;

	// gen - begin
	
	@OneToOne({ entity: () => OptionsPropertyValues, mappedBy: 'value', hidden: true })
	optionsPropertyValuesByValue: OptionsPropertyValues;
	
	// gen - end
}
