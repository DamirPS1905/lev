import { CreateCompanyDto } from './../../dtos/create-company.dto'
import { UpdateCompanyDto } from './../../dtos/update-company.dto'
import { CompaniesService } from './../../services/companies.service'
import { EntityManager } from '@mikro-orm/postgresql'
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger'

@ApiTags('Companies')
@Controller('catalog/:catalog/company')
export class GenCompaniesController {
	constructor(
		protected readonly companiesService: CompaniesService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.companiesService.findById(id);
		if(entity===null){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	@ApiExcludeEndpoint() validateRead(entity, id: number) { }
	
	@Post()
	async create(@Body() createDto: CreateCompanyDto) {
		createDto.id = id;
		return await this.companiesService.transactional(async (em) => {
			const existed1 = await this.companiesService.findByTitle(createDto.title, em);
			if(existed1!==null){
				throw new HttpException('Duplicate (title)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, em);
			return await this.companiesService.create(createDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateCreate(createDto: CreateCompanyDto, em: EntityManager) { }
	
	@Patch(':id')
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCompanyDto) {
		updateDto.id = id;
		return await this.companiesService.transactional(async (em) => {
			const entity = await this.companiesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			const existed1 = await this.companiesService.findByTitle(updateDto.title, em);
			if(existed1!==null || (entity.id !== existed1.id)){
				throw new HttpException('Duplicate (title)', HttpStatus.CONFLICT);
			}
			this.validateUpdate(entity, id, updateDto, em);
			return await this.companiesService.update(entity, updateDto, em);
		});
	}
	
	@ApiExcludeEndpoint() validateUpdate(entity, id: number, updateDto: UpdateCompanyDto, em: EntityManager) { }
	
	@Delete(':id')
	async delete(@Param('id', ParseIntPipe) id: number) {
		return await this.companiesService.transactional(async (em) => {
			const entity = await this.companiesService.findById(id, em);
			if(entity===null){
				throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
			}
			this.validateDelete(entity, id, em);
			return await this.companiesService.remove(entity, em);
		});
	}
	
	@ApiExcludeEndpoint() validateDelete(entity, id: number, em: EntityManager) { }
	
}