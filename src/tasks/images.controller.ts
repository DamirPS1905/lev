import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CatalogTypesService } from './catalog-types.service';
import { CatalogTypesOverloadService } from './catalog-types-overload.service';
import { CreateCatalogTypeDto } from './dto/create-catalog-type.dto';
import { UpdateCatalogTypeDto } from './dto/update-catalog-type.dto';

export class ImagesController {
  
  constructor(
	  private readonly imgageService: CatalogTypesService,
  ) {}
  
}