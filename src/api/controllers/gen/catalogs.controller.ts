/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/catalogs.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateCatalogDto } from './../../dtos/create-catalog.dto'
import { UpdateCatalogDto } from './../../dtos/update-catalog.dto'
import { CatalogsService } from './../../services/catalogs.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Catalogs')
@Controller('catalog')
export class GenCatalogsController {
	constructor(
		protected readonly catalogsService: CatalogsService,
	) { }
	
	async findAll(apiKey: ApiKeys) {
		return await this.catalogsService.getAllByCompany(apiKey.company.id);
	}
	
}