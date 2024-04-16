import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateCatalogDto } from './../dtos/create-catalog.dto'
import { UpdateCatalogDto } from './../dtos/update-catalog.dto'
import { CatalogsService } from './../services/catalogs.service'
import { GenCatalogsController } from './gen/catalogs.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { DefaultValuePipe, Get, Param, ParseIntPipe, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation } from '@nestjs/swagger'

export class CatalogsController extends GenCatalogsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка каталогов"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	
}