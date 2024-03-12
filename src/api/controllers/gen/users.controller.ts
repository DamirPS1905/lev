import { CreateUserDto } from './../../dtos/create-user.dto'
import { UpdateUserDto } from './../../dtos/update-user.dto'
import { UsersService } from './../../services/users.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('catalog/:catalog/user')
export class GenUsersController {
	constructor(
		protected readonly usersService: UsersService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.usersService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, id: number) { }
	
	@Post()
	async create(@Body() createDto: CreateUserDto) {
		createDto.id = id;
		return await this.usersService.transactional(async (em) => {
			const existed0 = await this.usersService.findByLogin(createDto.login, em);
			if(existed0!==null){
				throw new HttpException('Duplicate (login)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, em);
			return await this.usersService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(createDto: CreateUserDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateUserDto) {
		updateDto.id = id;
		return await this.usersService.transactional(async (em) => {
			const entity = await this.usersService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			const existed0 = await this.usersService.findByLogin(updateDto.login, em);
			if(existed0!==null || (entity.id !== existed0.id)){
				throw new HttpException('Duplicate (login)', HttpStatus.CONFLICT);
			}
			this.validateUpdate(entity, id, updateDto, em);
			return await this.usersService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, id: number, updateDto: UpdateUserDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.usersService.transactional(async (em) => {
			const entity = await this.usersService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, id, em);
			return await this.usersService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, id: number, em: EntityManager) { }
	
}