/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-rate.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenCreateRateDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	from:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	to:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	source:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	rate:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	updatedAt:Date;
	
}