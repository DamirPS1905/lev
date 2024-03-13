import { GenCatalogTypesController } from './gen/catalog-types.controller';
import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogTypeDto } from './../dtos/create-catalog-type.dto'
import { UpdateCatalogTypeDto } from './../dtos/update-catalog-type.dto'
import { EntityManager } from '@mikro-orm/postgresql'
import { HttpException, HttpStatus } from '@nestjs/common'



export class CatalogTypesController extends GenCatalogTypesController {
	
	validateUpdate(entity, apiKey: ApiKeys, catalog: number, id: number, updateDto: UpdateCatalogTypeDto, em: EntityManager) {
		let parent = updateDto.parent;
	  if(parent!==undefined && entity.parent.id!==parent){
		  const parentType = await this.catalogTypesService.findById(parent);
		  if(parentType===null || parentType.catalog.id!==catalog){
				throw new HttpException("Родительский тип не найден", HttpStatus.NOT_FOUND);
		  }
		  if(await this.catalogTypesOverloadService.findByParentAndChild(entity.id, parentType.id, em)){
				throw new HttpException("Новый родительский тип является дочерним поотношению к данному", HttpStatus.CONFLICT);			
		  }
		 	updateCatalogTypeDto.level = parentType.level + 1;
	  }else{
		  parent = entity.parent.id;
	  }
	}
	
	processInputParent(catalog: number, parent: number, em: EntityManager = null){
		if(parent===0){
			return await this.catalogTypesService.findRoot(catalog, em).id;
		}else{
			return parent;
		}
	}

	
}