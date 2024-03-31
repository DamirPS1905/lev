import { Entity, PrimaryKey, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity()
export class RatesHistory {

  [PrimaryKeyProp]?: ['from', 'to', 'source', 'date'];

  @PrimaryKey()
  from!: number;

  @PrimaryKey()
  to!: number;

  @PrimaryKey()
  source!: number;

  @PrimaryKey({ columnType: 'date' })
  date!: string;

  @Property({ columnType: 'numeric(18,9)' })
  rate!: string;

}
