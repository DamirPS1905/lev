import { Injectable } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EntityRepository, QueryOrder, wrap, EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Catalogs } from '../entities/Catalogs';


@Injectable()
export class CatalogsService {
	
	constructor(
    @InjectRepository(Catalogs)
    private readonly cataogRepository: EntityRepository<Catalogs>,
    private readonly em: EntityManager,
  ) { }

  create(createCatalogDto: CreateCatalogDto) {
    return 'This action adds a new catalog';
  }

  findAll() {
    return `This action returns all catalogs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catalog`;
  }

  update(id: number, updateCatalogDto: UpdateCatalogDto) {
    return `This action updates a #${id} catalog`;
  }

  remove(id: number) {
    return `This action removes a #${id} catalog`;
  }
}
