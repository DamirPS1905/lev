/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-catalog-product-offer.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class GenCreateCatalogProductOfferDto {
	
	product:bigint;
	
	catalog:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Артикул товарного предложения' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	article:string;
	
	created:Date;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Изображение товарного предложения; передается в формате трансфера изображений (`[key]` или `b64:[extension]:[base-64 encoded content]` или `url:[extension]:[publically available url]` или `url::[publically available url]`)' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	image:string;
	
}