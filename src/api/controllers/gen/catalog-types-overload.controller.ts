import { CreateCatalogTypesOverloadDto } from './../../dtos/create-catalog-types-overload.dto'
import { UpdateCatalogTypesOverloadDto } from './../../dtos/update-catalog-types-overload.dto'
import { CatalogTypesOverloadService } from './../../services/catalog-types-overload.service'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('catalog/:catalog/catalog-types-overload')
export class GenCatalogTypesOverloadController {
	constructor(
		protected readonly catalogTypesOverloadService: CatalogTypesOverloadService,
	) { }
	
	@Get(':child_:parent')
	async findOne(@Param('child', ParseIntPipe) child: number, @Param('parent', ParseIntPipe) parent: number) {
		const entity = await this.catalogTypesOverloadService.findByChildAndParent(child, parent);
		if(!entity){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, child, parent);
		return entity;
	}
	
	validateRead(entity, child, parent) { }
	
}