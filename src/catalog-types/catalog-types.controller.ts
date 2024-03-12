import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CatalogTypesService } from './catalog-types.service';
import { CatalogTypesOverloadService } from './catalog-types-overload.service';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './dto/update-catalog-type.dto';

@Controller('catalog/:catalog_id/type')
export class CatalogTypesController {
  
  constructor(
	  private readonly catalogTypesService: CatalogTypesService,
	  private readonly catalogTypesOverloadService: CatalogTypesOverloadService
  ) {}

  @Post()
  async create(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Body() createCatalogTypeDto: CreateCatalogTypeDto) {
	  const parent = createCatalogTypeDto.parent || 0;
	  if(parent===0){
		  const root = await this.catalogTypesService.findRoot(catalog_id);
		  createCatalogTypeDto.parent = root.id; 
		  createCatalogTypeDto.level = 1;
	  }else{
		  const parentType = await this.catalogTypesService.findInCatalogById(catalog_id, parent);
		  if(!parentType){
				throw new HttpException("Родительский тип не найден", HttpStatus.NOT_FOUND);
		  }
		 	createCatalogTypeDto.level = parentType.level + 1;
	  }
	  const existed = await this.catalogTypesService.findByParentAndTitle(createCatalogTypeDto.parent, createCatalogTypeDto.title);
	  if(!!existed){
			throw new HttpException("Тип с таким наименованием уже существует у текущего родительского типа", HttpStatus.CONFLICT);
	  }
	  createCatalogTypeDto.catalog = catalog_id;
    return await this.catalogTypesService.create(createCatalogTypeDto);
  }

  /*@Get()
  findAll() {
    return this.catalogTypesService.findAll();
  }*/

  @Get('root')
  async findRoot(@Param('catalog_id', ParseIntPipe) catalog_id: number) {
	  return await this.catalogTypesService.findRoot(catalog_id);
  }

  @Get(':id')
  async findOne(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number) {
	  const type = await this.catalogTypesService.findInCatalogById(catalog_id, id);
		if(!type){
			throw new HttpException("Тип не найден", HttpStatus.NOT_FOUND);
		}
    return type;
  }


  @Patch(':id')
  async update(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number, @Body() updateCatalogTypeDto: UpdateCatalogTypeDto) {
	  const type = await this.catalogTypesService.findInCatalogById(catalog_id, id);
	  let parent = updateCatalogTypeDto.parent;
		if(!type){
			throw new HttpException("Тип не найден", HttpStatus.NOT_FOUND);
		}
	  if(parent>0 && type.parent.id!==parent){
		  const parentType = await this.catalogTypesService.findInCatalogById(catalog_id, parent);
		  if(!parentType){
				throw new HttpException("Родительский тип не найден", HttpStatus.NOT_FOUND);
		  }
		  if(await this.catalogTypesOverloadService.findByParentAndChild(type.id, parentType.id)){
				throw new HttpException("Новый родительский тип является дочерним поотношению к данному", HttpStatus.CONFLICT);			
		  }
		 	updateCatalogTypeDto.level = parentType.level + 1;
	  }else{
		  parent = type.parent.id;
	  }
		if(!!updateCatalogTypeDto.title){
		  const existed = await this.catalogTypesService.findByParentAndTitle(parent, updateCatalogTypeDto.title);
		  if(!!existed && existed.id!==type.id){
				throw new HttpException("Тип с таким наименованием уже существует у текущего родительского типа", HttpStatus.CONFLICT);
		  }
		}
    return await this.catalogTypesService.update(type, updateCatalogTypeDto);
  }

  @Delete(':id')
  async remove(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number) {
	  const type = await this.catalogTypesService.findInCatalogById(catalog_id, id);
		if(!type){
			throw new HttpException("Тип не найден", HttpStatus.NOT_FOUND);
		}
		if(await this.catalogTypesService.hasChildren(type.id)){
			throw new HttpException("Тип с содержит дочерние типы", HttpStatus.CONFLICT);			
		}
    return await this.catalogTypesService.remove(type);
  }
}
