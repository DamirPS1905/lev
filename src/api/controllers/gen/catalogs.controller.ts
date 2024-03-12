import { CreateCatalogDto } from './../../dtos/create-catalog.dto'
import { UpdateCatalogDto } from './../../dtos/update-catalog.dto'
import { CatalogsService } from './../../services/catalogs.service'
import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Catalogs')
@Controller('catalog/:catalog/catalog')
export class GenCatalogsController {
	constructor(
		protected readonly catalogsService: CatalogsService,
	) { }
	
	@Get(':id')
	async findOne(@Param('id', ParseIntPipe) id: number) {
		const entity = await this.catalogsService.findById(id);
		if(!entity){
			throw new HttpException('Entity not found', HttpStatus.NOT_FOUND);
		}
		this.validateRead(entity, id);
		return entity;
	}
	
	validateRead(entity, id) { }
	
	@Post()
	async create(@Body() createDto: CreateCatalogDto) {
		return await this.catalogsService.transactional(async (em) => {
			const existed = await this.catalogsService.findByTitleAndCompany(createDto.title, createDto.company, em);
			if(existed!==null){
				throw new HttpException('Duplicate (title, company)', HttpStatus.CONFLICT);
			}
			this.validateCreate(createDto, );
			return await this.catalogsService.create(createDto, em);
		});
	}
	
	validateCreate(createDto: CreateCatalogDto, ) { }
	
}