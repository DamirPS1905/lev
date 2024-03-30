import { Entity, type Hidden, type Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Currencies {

  @PrimaryKey({ columnType: 'smallint' })
  id!: number;

  @Unique({ name: 'currencies_key_uind' })
  @Property()
  key!: string;

  @Unique({ name: 'currencies_title_uind' })
  @Property()
  title!: string;

  @Property({ type: 'string', hidden: true })
  symbol: string & Hidden & Opt = '';

  @Property({ type: 'number', hidden: true })
  precision: number & Hidden & Opt = 4;

  @Property({ type: 'string', nullable: true, hidden: true })
  icon?: string & Hidden;

}
