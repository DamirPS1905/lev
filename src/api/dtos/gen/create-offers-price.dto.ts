/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-offers-price.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenCreateOffersPriceDto {
	
	offer:bigint;
	
	priceType:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	value:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	currency:number;
	
}