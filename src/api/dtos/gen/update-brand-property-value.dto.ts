/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-brand-property-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GenUpdateBrandPropertyValueDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	instance:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	property:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	order:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	value:bigint;
	
}