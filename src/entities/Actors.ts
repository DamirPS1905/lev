import { ActorTypes } from './ActorTypes';
import { ApiKeys } from './ApiKeys';
import { Companies } from './Companies';
import { Users } from './Users';
import { Collection, Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';

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
	
	@OneToOne({ entity: () => ApiKeys, mappedBy: 'actor' })
	apiKeysByActor: ApiKeys;
	
	@OneToOne({ entity: () => Users, mappedBy: 'actor' })
	usersByActor: Users;
	
	// gen - end
}
