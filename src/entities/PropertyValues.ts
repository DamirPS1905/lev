import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { PropertyTypes } from './PropertyTypes';

@Entity()
export class PropertyValues {

  [PrimaryKeyProp]?: ['valueKey', 'order'];

  @PrimaryKey()
  valueKey!: bigint;

  @PrimaryKey({ columnType: 'smallint' })
  order!: number;

  @ManyToOne({ entity: () => PropertyTypes, fieldName: 'type' })
  type!: PropertyTypes;

  @Property({ columnType: 'jsonb' })
  value!: any;

}
