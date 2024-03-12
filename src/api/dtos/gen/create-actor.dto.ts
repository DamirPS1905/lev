import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenCreateActorDto {
	
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
	
}