import { Injectable } from '@nestjs/common';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './dto/update-catalog-type.dto';
import { EntityRepository, QueryOrder, wrap, EntityManager, raw } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CatalogTypesOverload } from '../entities/CatalogTypesOverload';

@Injectable()
export class CatalogTypesOverloadService {
	
	constructor(
    @InjectRepository(CatalogTypesOverload)
    private readonly typeOverloadRepository: EntityRepository<CatalogTypesOverload>,
    private readonly em: EntityManager,
  ) { }


  findByParentAndChild(parent: number, child: number) {
		return this.typeOverloadRepository.findOne({
			parent: parent,
			child: child,
		});
  }

}
