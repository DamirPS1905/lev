/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-catalog-brand-collection.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class GenCreateCatalogBrandCollectionDto {
	
	brand:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Наименование коллекции бренда; должно быть уникально для бренда' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	title:string;
	
}