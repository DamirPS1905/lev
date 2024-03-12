import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ActorTypes } from './ActorTypes';

@Entity()
export class Actors {

  @PrimaryKey()
  id!: number;

  @OneToOne({ entity: () => ActorTypes, fieldName: 'type', unique: 'actors_type_key_uind' })
  type!: ActorTypes;

  @Property({ nullable: true })
  key?: number;

}
