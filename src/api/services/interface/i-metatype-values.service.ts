import { EntityManager } from '@mikro-orm/postgresql'

export interface IMetatypeVauesService<P>{
	findByInstanceAndPropertyAndOrder(instance: P, property: number, order: number, emt: EntityManager = null);
	findAllByInstanceAndProperty(instance: P, property: number, emt: EntityManager = null);
	removeExtraByInstanceAndPropertyAndMaxOrder(instance: P, property: number, maxOrder: number, andValues: boolean, emt: EntityManager = null);
	readValuesByInstanceAndProperty(instance: P, property: number, emt: EntityManager = null);
	readValueByInstanceAndProperty(instance: P, property: number, emt: EntityManager = null);
	readValuesByInstance(instance: P, emt: EntityManager = null);
	transactional(cb);
}


