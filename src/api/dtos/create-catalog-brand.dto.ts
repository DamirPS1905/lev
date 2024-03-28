import { GenCreateCatalogBrandDto } from './gen/create-catalog-brand.dto';
import { ApiProperty } from '@nestjs/swagger'
import { Type, Transform, TransformFnParams } from 'class-transformer'
import { IsString, IsOptional, ValidateNested } from 'class-validator'
import { ImageDto } from './image.dto'

export class CreateCatalogBrandDto extends GenCreateCatalogBrandDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Изображение бренда' })
	@Type(() => ImageDto)
  @ValidateNested()
  logo:ImageDto;
	
}