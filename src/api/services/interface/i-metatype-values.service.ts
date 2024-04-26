import { EntityManager } from '@mikro-orm/postgresql';

export interface IMetatypeVauesService<P> {
  findByInstanceAndPropertyAndOrder(instance: P, property: number, order: number, emt: EntityManager);
  bindValueToInstance(value: bigint, instance: P, property: number, order: number, emt: EntityManager);
  findAllByInstanceAndProperty(instance: P, property: number, emt: EntityManager);
  removeExtraByInstanceAndPropertyAndMaxOrder(
    instance: P,
    property: number,
    maxOrder: number,
    andValues: boolean,
    emt: EntityManager,
  );
  readValuesByInstanceAndProperty(instance: P, property: number, emt: EntityManager);
  readValueByInstanceAndProperty(instance: P, property: number, emt: EntityManager);
  readValuesByInstance(instance: P, emt: EntityManager);
  transactional(cb);
}
