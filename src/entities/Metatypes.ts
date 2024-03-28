import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Metatypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'metatypes_title_uind' })
  @Property()
  title!: string;

}
