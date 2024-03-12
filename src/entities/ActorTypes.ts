import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class ActorTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'actor_types_title_uind' })
  @Property()
  title!: string;

}
