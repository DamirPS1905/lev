import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CatalogBrandsService } from './../db-services/catalog-brands.service';
import { CreateCatalogBrandDto } from './dto/create-catalog-brand.dto';
import { UpdateCatalogBrandDto } from './dto/update-catalog-brand.dto';

@Controller('catalog/:catalog_id/brand')
export class CatalogBrandsController {
  constructor(private readonly catalogBrandsService: CatalogBrandsService) {}

  @Post()
  async create(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Body() createCatalogBrandDto: CreateCatalogBrandDto) {
	  createCatalogBrandDto.catalog = catalog_id;
		const existed = await this.catalogBrandsService.findByCatalogAndTitle(catalog_id, createCatalogBrandDto.title);
		if(!!existed){
			throw new HttpException("Бренд с таким наименованием уже существует в каталоге", HttpStatus.CONFLICT);
		}
    return this.catalogBrandsService.create(createCatalogBrandDto);
  }

  @Get()
  findAll(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Query() params: any) {
	  let limit = +params.limit || 100;
	  if(limit>1000) limit = 1000;
	  if(limit<=0) limit = 100;
    return this.catalogBrandsService.findAll(catalog_id, limit, +params.offset || 0);
  }

  @Get(':id')
  async findOne(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number) {
	  const brand = await this.catalogBrandsService.findInCatalogById(catalog_id, id);
		if(!brand){
			throw new HttpException("Бренд не найден", HttpStatus.NOT_FOUND);
		}
    return brand;
  }

  @Patch(':id')
  async update(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number, @Body() updateCatalogBrandDto: UpdateCatalogBrandDto) {
	  const brand = await this.catalogBrandsService.findInCatalogById(catalog_id, id);
		if(!brand){
			throw new HttpException("Бренд не найден", HttpStatus.NOT_FOUND);
		}
		if(!!updateCatalogBrandDto.title){
			const existed = await this.catalogBrandsService.findByCatalogAndTitle(catalog_id, updateCatalogBrandDto.title);
			if(!!existed){
				if(existed.id!==brand.id)
					throw new HttpException("Бренд с таким наименованием уже существует в каталоге", HttpStatus.CONFLICT);
			}
		}
    return await this.catalogBrandsService.update(brand, updateCatalogBrandDto);
  }

  @Delete(':id')
  async remove(@Param('catalog_id', ParseIntPipe) catalog_id: number, @Param('id', ParseIntPipe) id: number) {
	  const brand = await this.catalogBrandsService.findInCatalogById(catalog_id, id);
		if(!brand){
			throw new HttpException("Бренд не найден", HttpStatus.NOT_FOUND);
		}
    return await this.catalogBrandsService.remove(brand);
  }
}
