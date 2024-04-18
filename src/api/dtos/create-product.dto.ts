import { GenCreateCatalogProductDto } from './gen/create-catalog-product.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateProductDto extends GenCreateCatalogProductDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Артикул первого или единственного товарного предложения' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	article:string;	
	
}