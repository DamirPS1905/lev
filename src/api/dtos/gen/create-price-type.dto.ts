/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-price-type.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GenCreatePriceTypeDto {
	
	company:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Наименование типа цены; должно быть уникально' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Валюта в котрой следует отобажать цены данного типа' })
	@IsInt()
	displayCurrency:number;
	
	@IsNotEmpty()
	@ApiProperty({ description: 'Валюта по умолчанию для цен данного типа' })
	@IsInt()
	baseCurrency:number;
	
}