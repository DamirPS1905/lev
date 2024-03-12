import { Injectable } from '@nestjs/common';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './dto/update-catalog-type.dto';
import { EntityRepository, QueryOrder, wrap, EntityManager, raw } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CatalogTypes } from '../entities/CatalogTypes';

@Injectable()
export class CatalogTypesService {
	
	constructor(
    @InjectRepository(CatalogTypes)
    private readonly typeRepository: EntityRepository<CatalogTypes>,
    private readonly em: EntityManager,
  ) { }

  async create(createCatalogTypeDto: CreateCatalogTypeDto) {
    const em = this.em.fork(),
    			type = em.create(CatalogTypes, createCatalogTypeDto);
    await em.persist(type).flush();
    return type;
  }


  findById(id: number) {
		return this.typeRepository.findOne({
			id: id,
		});
  }
  
  findRoot(catalog: number) {
		return this.typeRepository.findOne({
			catalog: catalog,
			parent: { $eq: null }
		});
  }

  findChildren(parent: number) {
		return this.typeRepository.find({
			parent: parent
		});
  }

  async hasChildren(parent: number) {
	  const children = await this.typeRepository.find({
			parent: parent
		}, {
			limit: 1
		});
		return children.length>0;
  }

  findInCatalogById(catalog: number, id: number) {
		return this.typeRepository.findOne({
			id: id,
			catalog: catalog
		});
  }

  findByParentAndTitle(parent: number, title: string) {
		return this.typeRepository.findOne({
			title: title,
			parent: parent
		});
  }
  
  async update(type: CatalogTypes, updateCatalogTypeDto: UpdateCatalogTypeDto) {
    wrap(type).assign(updateCatalogTypeDto);
    await this.em.fork().persist(type).flush();
    return type;
  }

  
  remove(type: CatalogTypes) {
    return this.em.fork().remove(type).flush();
  }

}
