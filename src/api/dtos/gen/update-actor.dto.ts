/*
 * This code was generated automatically
 * and should not be modifiyed manyally,
 * becouse it can be overwritten in any
 * moment. All modifications are allowed
 * in api/dtos/update-actor.dto
 * in a proper way.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export class GenUpdateActorDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	id:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	type:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	key:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	company:number;
	
}