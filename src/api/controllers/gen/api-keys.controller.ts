import { CreateApiKeyDto } from './../../dtos/create-api-key.dto'
import { UpdateApiKeyDto } from './../../dtos/update-api-key.dto'
import { ApiKeysService } from './../../services/api-keys.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@ApiTags('Api keys')
@Controller('catalog/:catalog/api-key')
export class GenApiKeysController {
	constructor(
		protected readonly apiKeysService: ApiKeysService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.apiKeysService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, id: number) { }
	
	@Post()
	async create(@Body() createDto: CreateApiKeyDto) {
		createDto.id = id;
		return await this.apiKeysService.transactional(async (em) => {
			const existed0 = await this.apiKeysService.findByKey(createDto.key, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (key)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, em);
			return await this.apiKeysService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(createDto: CreateApiKeyDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateApiKeyDto) {
		updateDto.id = id;
		return await this.apiKeysService.transactional(async (em) => {
			const entity = await this.apiKeysService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			const existed0 = await this.apiKeysService.findByKey(updateDto.key, em);
			if(existed0!==null || (entity.id !== existed0.id)){
				throw new HttpException('Duplicate (key)', HttpStatus.CONFLICT);
			}
			this.validateUpdate(entity, id, updateDto, em);
			return await this.apiKeysService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, id: number, updateDto: UpdateApiKeyDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.apiKeysService.transactional(async (em) => {
			const entity = await this.apiKeysService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, id, em);
			return await this.apiKeysService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, id: number, em: EntityManager) { }
	
}