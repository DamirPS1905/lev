import { Entity, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Actors } from './Actors';

@Entity()
export class ActorTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'actor_types_title_uind' })
  @Property()
  title!: string;

  @OneToOne({ entity: () => Actors, mappedBy: 'type' })
  typeInverse?: Actors;

}
