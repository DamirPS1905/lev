import { Injectable } from '@nestjs/common';
import { CreateCatalogBrandDto } from './dto/create-catalog-brand.dto';
import { UpdateCatalogBrandDto } from './dto/update-catalog-brand.dto';
import { EntityRepository, QueryOrder, wrap, EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CatalogBrands } from '../entities/CatalogBrands';


@Injectable()
export class CatalogBrandsService {
	
	constructor(
    @InjectRepository(CatalogBrands)
    private readonly brandRepository: EntityRepository<CatalogBrands>,
    private readonly em: EntityManager,
  ) { }

	
  async create(createCatalogBrandDto: CreateCatalogBrandDto) {
    const em = this.em.fork(),
    			brand = em.create(CatalogBrands, createCatalogBrandDto);
    await em.persist(brand).flush();
    return brand;
  }

  findAll(catalog_id: number, limit: number, offset: number) {
	  return this.brandRepository.find({
		  catalog: catalog_id
	  }, {
		  limit: limit,
		  offset: offset,
		  orderBy: { id: 'asc' },
		});
  }

  findById(id: number) {
		return this.brandRepository.findOne({
			id: id,
		});
  }

  findInCatalogById(catalog: number, id: number) {
		return this.brandRepository.findOne({
			id: id,
			catalog: catalog
		});
  }

  findByCatalogAndTitle(catalog: number, title: string) {
		return this.brandRepository.findOne({
			title: title,
			catalog: catalog
		});
  }

  async update(brand: CatalogBrands, updateCatalogBrandDto: UpdateCatalogBrandDto) {
    wrap(brand).assign(updateCatalogBrandDto);
    await this.em.fork().persist(brand).flush();
    return brand;
  }

  remove(brand: CatalogBrands) {
    return this.em.fork().remove(brand).flush();
  }
}
