/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-product-price.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenCreateProductPriceDto {
	
	product:bigint;
	
	priceType:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Значение цены' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	value:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Валюта в которой указано значение цены; если не задано, то бует использована базовая валюта для данного типа цены' })
	@IsInt()
	currency:number;
	
	updatedAt:Date;
	
	index:string;
	
	deleted:boolean;
	
}