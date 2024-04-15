/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-store.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GenUpdateStoreDto {
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Наименование склада; должно быть уникально' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	title:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Адрес склада' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	address:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Широта геопозиции склада' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	geoLat:string;
	
	@IsOptional()
	@ApiProperty({ required: false, description: 'Долгота геопозиции склада' })
	@IsString()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	geoLong:string;
	
}