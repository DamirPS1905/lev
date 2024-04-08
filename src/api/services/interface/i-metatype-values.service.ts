import { EntityManager } from '@mikro-orm/postgresql'

export interface IMetatypeVauesService{
	findByInstanceAndPropertyAndOrder(instance: number, property: number, order: number, emt: EntityManager = null);
	findAllByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null);
	readValuesByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null);
	readValueByInstanceAndProperty(instance: number, property: number, emt: EntityManager = null);
	readValuesByInstance(instance: number, emt: EntityManager = null);
	transactional(cb);
}


