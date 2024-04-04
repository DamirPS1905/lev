import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogMetatypeDto } from './../dtos/create-catalog-metatype.dto'
import { UpdateCatalogMetatypeDto } from './../dtos/update-catalog-metatype.dto'
import { CatalogMetatypesService } from './../services/catalog-metatypes.service'
import { GenCatalogMetatypesController } from './gen/catalog-metatypes.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get, Param, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogMetatypesController extends GenCatalogMetatypesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(apiKey, catalog);
	}
	
	
}