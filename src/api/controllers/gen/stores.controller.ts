/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/controllers/stores.controller
 * in a proper way.
 */
import { AuthInfo } from './../../../decorators/auth.decorator'
import { ApiKeys } from './../../../entities/ApiKeys'
import { CreateStoreDto } from './../../dtos/create-store.dto'
import { UpdateStoreDto } from './../../dtos/update-store.dto'
import { StoresService } from './../../services/stores.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Controller, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiHeader, ApiTags } from '@nestjs/swagger'

@ApiHeader({ name: 'X-API-KEY', required: true })
@UseGuards(AuthGuard('api-key'))
@ApiTags('Stores')
@Controller('store')
export class GenStoresController {
	constructor(
		protected readonly storesService: StoresService,
	) { }
	
	async findAll(apiKey: ApiKeys, apiKey.company.id: number, offset: number, limit: number) {
		if(offset<0) throw new HttpException('Wrong offset value', HttpStatus.BAD_REQUEST);
		if(limit<0) throw new HttpException('Wrong limit value', HttpStatus.BAD_REQUEST);
		if(limit>1000) limit = 1000;
		return await this.storesService.listByCompany(apiKey.company.id, offset, limit);
	}
	
	async findOne(apiKey: ApiKeys, id: number) {
		const entity = await this.storesService.findById(id);
		if(entity===null || !(entity.company.id===apiKey.company.id)){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		await this.validateRead(entity, apiKey, id);
		return entity;
	}
	
	async validateRead(entity, apiKey: ApiKeys, id: number) { }
	
	async create(apiKey: ApiKeys, createDto: CreateStoreDto) {
		createDto.company = apiKey.company.id;
		return await this.storesService.transactional(async (em) => {
			const existed0 = await this.storesService.findByCompanyAndTitle(createDto.company, createDto.title, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
			}
			await this.validateCreate(apiKey, createDto, em);
			return await this.storesService.create(createDto, em);
		});
	}
	
	async validateCreate(apiKey: ApiKeys, createDto: CreateStoreDto, em: EntityManager) { }
	
	async update(apiKey: ApiKeys, id: number, updateDto: UpdateStoreDto) {
		return await this.storesService.transactional(async (em) => {
			const entity = await this.storesService.findById(id, em);
			if(entity===null || !(entity.company.id===apiKey.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			if((updateDto.title!==undefined && updateDto.title!==entity.title)){
				const existed0 = await this.storesService.findByCompanyAndTitle(entity.company.id, updateDto.title, em);
				if(existed0!==null && (entity.id !== existed0.id)){
					throw new HttpException('Duplicate (company, title)', HttpStatus.CONFLICT);
				}
			}
			this.validateUpdate(entity, apiKey, id, updateDto);
			return await this.storesService.update(entity, updateDto, em);
		});
	}
	
	async validateUpdate(entity, apiKey: ApiKeys, id: number, updateDto: UpdateStoreDto) { }
	
	async delete(apiKey: ApiKeys, id: number) {
		return await this.storesService.transactional(async (em) => {
			const entity = await this.storesService.findById(id, em);
			if(entity===null || !(entity.company.id===apiKey.company.id)){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			await this.validateDelete(entity, apiKey, id, em);
			return await this.storesService.remove(entity, em);
		});
	}
	
	async validateDelete(entity, apiKey: ApiKeys, id: number, em: EntityManager) { }
	
}