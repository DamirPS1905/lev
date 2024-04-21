/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/create-instance-version.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GenCreateInstanceVersionDto {
	
	company:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	catalog:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	instanceType:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	instance:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	version:bigint;
	
	@IsOptional()
	@ApiProperty({ required: false })
	deleted:boolean;
	
}