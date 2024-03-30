/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-offers-price.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, TransformFnParams } from 'class-transformer'
import { IsInt, IsOptional, IsString } from 'class-validator'

export class GenUpdateOffersPriceDto {
	
	offer:bigint;
	
	priceType:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	value:string;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	currency:number;
	
}