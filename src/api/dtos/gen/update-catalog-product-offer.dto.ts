/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-catalog-product-offer.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class GenUpdateCatalogProductOfferDto {
	
	product:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@MinLength(1)
	@MaxLength(255)
	article:string;
	
}