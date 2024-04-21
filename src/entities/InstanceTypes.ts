import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class InstanceTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'instance_types_title_uind' })
  @Property()
  title!: string;

}
