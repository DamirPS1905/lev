import { Entity, ManyToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Actors } from './Actors';
import { Companies } from './Companies';

@Entity()
export class Users {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'users_login_uind' })
  @Property()
  login!: string;

  @Property()
  pwdHash!: string;

  @ManyToOne({ entity: () => Actors, fieldName: 'actor' })
  actor!: Actors;

  @Property({ length: 6 })
  created!: Date;

  @ManyToOne({ entity: () => Companies, fieldName: 'company' })
  company!: Companies;

}
