/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-catalog-product.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GenUpdateCatalogProductDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Тип товара к которому принадлежит данный товар' })
	@IsInt()
	type:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Бренд товара к которому принадлежит данный товар' })
	@IsInt()
	brand:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Наименование товара; должно быть уникально в рамках каталога' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Коллекция бренда, к которой принадлежит данный товар' })
	@IsInt()
	collection:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Единица измерения, в которой будет учитываться товар' })
	@IsInt()
	accountingUnit:number;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Изображение товара; передается в формате трансфера изображений (`[key]` или `b64:[extension]:[base-64 encoded content]` или `url:[extension]:[publically available url]` или `url:[publically available url]`)' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	image:string;
	
}