import { GenCreateCatalogBrandDto } from './gen/create-catalog-brand.dto';
import { ApiProperty } from '@nestjs/swagger'
import { Type, Transform, TransformFnParams } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'

export class CreateCatalogBrandDto extends GenCreateCatalogBrandDto {
	
}