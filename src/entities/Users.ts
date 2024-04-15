import { Entity, type Hidden, ManyToOne, OneToOne, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Actors } from './Actors';
import { Companies } from './Companies';

@Entity()
export class Users {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'users_login_uind' })
  @Property()
  login!: string;

  @Property({ type: 'string', hidden: true })
  pwdHash!: string & Hidden;

  @OneToOne({ entity: () => Actors, fieldName: 'actor', hidden: true, unique: 'users_actor_uind' })
  actor!: Actors & Hidden;

  @Property({ length: 6 })
  created!: Date;

  @ManyToOne({ entity: () => Companies, fieldName: 'company' })
  company!: Companies;

}
