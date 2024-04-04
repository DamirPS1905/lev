import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreateCatalogDto } from './../dtos/create-catalog.dto'
import { UpdateCatalogDto } from './../dtos/update-catalog.dto'
import { CatalogsService } from './../services/catalogs.service'
import { GenCatalogsController } from './gen/catalogs.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class CatalogsController extends GenCatalogsController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	
}