import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ActorTypes } from './ActorTypes';
import { ApiKeys } from './ApiKeys';
import { Companies } from './Companies';
import { Users } from './Users';

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

  @OneToOne({ entity: () => ApiKeys, mappedBy: 'actor', hidden: true })
  apiKeysByActor: ApiKeys;

  @OneToOne({ entity: () => Users, mappedBy: 'actor', hidden: true })
  usersByActor: Users;

  // gen - end
}
