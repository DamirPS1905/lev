import { AuthInfo } from './../../decorators/auth.decorator';
import { Actors } from './../../entities/Actors';
import { CreateProductsRelationKindDto } from './../dtos/create-products-relation-kind.dto';
import { UpdateProductsRelationKindDto } from './../dtos/update-products-relation-kind.dto';
import { ProductsRelationKindsService } from './../services/products-relation-kinds.service';
import { GenProductsRelationKindsController } from './gen/products-relation-kinds.controller';
import { EntityManager } from '@mikro-orm/postgresql';
import { Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger'

export class ProductsRelationKindsController extends GenProductsRelationKindsController {
	
	@Get('all')
	@ApiOperation({summary: "Получение списка доступных видов отношений товаров"})
	async findAll(@AuthInfo() actor: Actors) {
		return await super.findAll(actor);
	}
	
	
}