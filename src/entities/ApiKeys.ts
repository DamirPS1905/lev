import { Entity, ManyToOne, OneToOne, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Actors } from './Actors';
import { Companies } from './Companies';

@Entity()
export class ApiKeys {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'api_keys_key_uind' })
  @Property()
  key!: string;

  @ManyToOne({ entity: () => Companies, fieldName: 'company' })
  company!: Companies;

  @Property({ type: 'boolean', nullable: true })
  disposed?: boolean & Opt = false;

  @Property({ type: 'Date', length: 6, defaultRaw: `CURRENT_TIMESTAMP` })
  createdAt!: Date & Opt;

  @Property({ length: 6, nullable: true })
  disposedAt?: Date;

  @OneToOne({ entity: () => Actors, fieldName: 'actor', unique: 'api_keys_actor_uind' })
  actor!: Actors;

}
