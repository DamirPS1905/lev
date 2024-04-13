/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-product-property-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GenCreateProductPropertyValueDto {
	
	product:bigint;
	
	property:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	valueKey:bigint;
	
}