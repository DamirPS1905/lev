import { AuthInfo } from './../../decorators/auth.decorator'
import { ApiKeys } from './../../entities/ApiKeys'
import { CreatePropertyPrimitiveDto } from './../dtos/create-property-primitive.dto'
import { UpdatePropertyPrimitiveDto } from './../dtos/update-property-primitive.dto'
import { PropertyPrimitivesService } from './../services/property-primitives.service'
import { GenPropertyPrimitivesController } from './gen/property-primitives.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class PropertyPrimitivesController extends GenPropertyPrimitivesController {
	
	@Get('all')
	async findAll(@AuthInfo() apiKey: ApiKeys) {
		return await super.findAll(apiKey);
	}
	
	
}