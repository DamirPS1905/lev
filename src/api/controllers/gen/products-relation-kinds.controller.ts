/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/products-relation-kinds.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator';
import { Actors } from './../../../entities/Actors';
import { CreateProductsRelationKindDto } from './../../dtos/create-products-relation-kind.dto';
import { UpdateProductsRelationKindDto } from './../../dtos/update-products-relation-kind.dto';
import { ProductsRelationKindsService } from './../../services/products-relation-kinds.service';
import { FsPatch } from './../../services/special/files.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiHeader({ name: 'X-API-KEY', required: true, description: 'Ваш идентефикатор апи' })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Products relation kinds')
@Controller('products-relation-kind')
export class GenProductsRelationKindsController {
	constructor(
		protected readonly productsRelationKindsService: ProductsRelationKindsService,
	) { }
	
	async findAll(actor: Actors) {
		return await this.productsRelationKindsService.findAll();
	}
	
}