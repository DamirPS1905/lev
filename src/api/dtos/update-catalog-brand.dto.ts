import { GenUpdateCatalogBrandDto } from './gen/update-catalog-brand.dto';
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'
import { ImageDto } from './image.dto'

export class UpdateCatalogBrandDto extends GenUpdateCatalogBrandDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Изображение бренда' })
	@Type(() => ImageDto)
  @ValidateNested()
  logo:ImageDto;
	
}