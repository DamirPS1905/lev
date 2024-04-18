import { Actors } from './Actors';
import { Collection, Entity, OneToMany, PrimaryKey, Property, Unique, type Hidden } from '@mikro-orm/core';

@Entity()
export class ActorTypes {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'actor_types_title_uind' })
  @Property()
  title!: string;

	// gen - begin
	
	@OneToMany({ entity: () => Actors, mappedBy: 'type', hidden: true })
	actorsByType: Collection<Actors> & Hidden = new Collection<Actors>(this);
	
	// gen - end
}
