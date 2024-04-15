import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreatePropertyPrimitiveDto } from './../dtos/create-property-primitive.dto'
import { UpdatePropertyPrimitiveDto } from './../dtos/update-property-primitive.dto'
import { PropertyPrimitivesService } from './../services/property-primitives.service'
import { GenPropertyPrimitivesController } from './gen/property-primitives.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiOperation, ApiParam } from '@nestjs/swagger'

export class PropertyPrimitivesController extends GenPropertyPrimitivesController {
	
	@Get('all')
	@ApiOperation({summary: "Получение всех доступных примитивов зачений свойств"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	
}