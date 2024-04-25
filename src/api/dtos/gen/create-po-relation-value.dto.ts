/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-po-relation-value.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GenCreatePoRelationValueDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	relation:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	source:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	target:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	deleted:boolean;
	
}