import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePropertyTypeDto } from './../dtos/create-property-type.dto'
import { UpdatePropertyTypeDto } from './../dtos/update-property-type.dto'
import { PropertyTypesService } from './../services/property-types.service'
import { GenPropertyTypesController } from './gen/property-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get, Param, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class PropertyTypesController extends GenPropertyTypesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(apiKey, catalog);
	}
	
	
}