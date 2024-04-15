import { ActorTypes } from './ActorTypes';
import { ApiKeys } from './ApiKeys';
import { Companies } from './Companies';
import { Users } from './Users';
import { Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Actors {

  @PrimaryKey()
  id!: number;

  @ManyToOne({ entity: () => ActorTypes, fieldName: 'type', unique: 'actors_type_key_uind' })
  type!: ActorTypes;

  @Property({ nullable: true })
  key?: number;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', deleteRule: 'cascade', nullable: true })
  company?: Companies;

	// gen - begin
	
	@OneToMany({ entity: () => ApiKeys, mappedBy: 'actor' })
	apiKeysByActor = new Collection<ApiKeys>(this);
	
	@OneToMany({ entity: () => Users, mappedBy: 'actor' })
	usersByActor = new Collection<Users>(this);
	
	// gen - end
}
