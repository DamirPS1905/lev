import { Entity, type Hidden, Index, ManyToOne, type Opt, PrimaryKey, Property } from '@mikro-orm/core';
import { Companies } from './Companies';

@Entity()
export class FileLoadTasks {

  @PrimaryKey()
  id!: bigint;

  @Property()
  url!: string;

  @Index({ name: 'file_load_tasks_processed_ind' })
  @Property({ type: 'boolean' })
  processed: boolean & Opt = false;

  @Property({ type: 'boolean' })
  loaded: boolean & Opt = false;

  @Property()
  key!: string;

  @Property({ nullable: true })
  error?: string;

  @Property()
  asImage!: boolean;

  @ManyToOne({ entity: () => Companies, fieldName: 'company', hidden: true })
  company!: Companies & Hidden;

}
