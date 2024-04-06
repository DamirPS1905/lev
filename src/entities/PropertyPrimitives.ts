import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class PropertyPrimitives {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'property_primitives_title_uind' })
  @Property()
  title!: string;

}
