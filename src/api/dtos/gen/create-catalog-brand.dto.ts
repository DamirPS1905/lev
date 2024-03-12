import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class GenCreateCatalogBrandDto {
	
	catalog:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Наименование бренда' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Описание бренда' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	description:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Изображение бренда' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	logo:string;
	
}