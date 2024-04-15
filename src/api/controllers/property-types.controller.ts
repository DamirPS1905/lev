import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreatePropertyTypeDto } from './../dtos/create-property-type.dto'
import { UpdatePropertyTypeDto } from './../dtos/update-property-type.dto'
import { PropertyTypesService } from './../services/property-types.service'
import { GenPropertyTypesController } from './gen/property-types.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get, Param, ParseIntPipe } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class PropertyTypesController extends GenPropertyTypesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех доступных типов свойств"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	async findAll(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number) {
		return await super.findAll(actor, catalog);
	}
	
	@Get(':id/value-scheme')
	@ApiOperation({summary: "Получение схемы значения свойств определенного типа"})
	@ApiParam({name: 'catalog', description: 'ID текущего каталога'})
	@ApiParam({name: 'id', description: 'ID типа свойства'})
	async getScheme(@AuthInfo() actor: Actors, @Param('catalog', ParseIntPipe) catalog: number, @Param('id', ParseIntPipe) id: number) {
		const propertyTypeIns = await super.findOne(actor, catalog, id);
		return this.propertyTypesService.getValueScheme(propertyTypeIns.scheme);
	}
}