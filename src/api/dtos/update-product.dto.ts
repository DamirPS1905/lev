import { GenUpdateCatalogProductDto } from './gen/update-catalog-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProductDto extends GenUpdateCatalogProductDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Артикул единственного товарного предложения (если у товара больше одного товарного предложения при предоставлении это парамета будет отдан ответ об ошибке)' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	article:string;	
	
}