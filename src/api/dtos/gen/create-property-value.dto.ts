/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-property-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenCreatePropertyValueDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	valueKey:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	type:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	value:any;
	
}