import { AuthInfo } from './../../decorators/auth.decorator'
import { Actors } from './../../entities/Actors'
import { CreateMetatypeDto } from './../dtos/create-metatype.dto'
import { UpdateMetatypeDto } from './../dtos/update-metatype.dto'
import { MetatypesService } from './../services/metatypes.service'
import { GenMetatypesController } from './gen/metatypes.controller'
import { EntityManager } from '@mikro-orm/postgresql'
import { Get } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

export class MetatypesController extends GenMetatypesController {
	
	@Get('all')
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	
}