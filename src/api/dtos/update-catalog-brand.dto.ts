import { GenUpdateCatalogBrandDto } from './gen/update-catalog-brand.dto';
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'

export class UpdateCatalogBrandDto extends GenUpdateCatalogBrandDto {
		
}