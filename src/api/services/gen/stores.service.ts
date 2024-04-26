/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/services/stores.service
 * in a proper way.
 */
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Stores } from './../../../entities/Stores';
import { CreateStoreDto } from './../../dtos/create-store.dto';
import { UpdateStoreDto } from './../../dtos/update-store.dto';
import { AService } from './../abstract/abstract.service';
import { FilesService } from './../special/files.service';

@Injectable()
export class GenStoresService extends AService {
  constructor(em: EntityManager, fm: FilesService) {
    super(em, fm);
  }

  async create(createDto: CreateStoreDto, emt: EntityManager = null) {
    const em = this.getEm(emt),
      instance = em.create(Stores, createDto);
    await em.persist(instance).flush();
    return instance;
  }

  async update(instance: Stores, updateDto: UpdateStoreDto, emt: EntityManager = null) {
    const em = this.getEm(emt);
    wrap(instance).assign(updateDto);
    await em.persist(instance).flush();
    return instance;
  }

  remove(instance: Stores, emt: EntityManager = null) {
    const em = this.getEm(emt);
    return em.remove(instance).flush();
  }

  findByCompanyAndTitle(company: number, title: string, emt: EntityManager = null) {
    const em = this.getEm(emt);
    return em.findOne(Stores, {
      company: company,
      title: title,
    });
  }

  findById(id: number, emt: EntityManager = null) {
    const em = this.getEm(emt);
    return em.findOne(Stores, {
      id: id,
    });
  }

  findAllByCompany(company: number, emt: EntityManager = null) {
    const em = emt || this.em.fork();
    return em.find(Stores, {
      company: company,
    });
  }

  listByCompany(company: number, offset: number, limit: number, emt: EntityManager = null) {
    const em = emt || this.em.fork();
    return em.find(
      Stores,
      {
        company: company,
      },
      {
        limit: limit,
        offset: offset,
        orderBy: { id: 'ASC' },
      },
    );
  }

  listAll(offset: number, limit: number, emt: EntityManager = null) {
    const em = emt || this.em.fork();
    return em.find(
      Stores,
      {},
      {
        limit: limit,
        offset: offset,
        orderBy: { id: 'ASC' },
      },
    );
  }

  findAll(emt: EntityManager = null) {
    const em = emt || this.em.fork();
    return em.find(
      Stores,
      {},
      {
        orderBy: { id: 'ASC' },
      },
    );
  }
}
