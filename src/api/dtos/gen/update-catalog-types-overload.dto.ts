import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional } from 'class-validator'

export class GenUpdateCatalogTypesOverloadDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	parent:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	child:number;
	
	@IsOptional()
	@ApiProperty({ required: false })
	@IsInt()
	delta:number;
	
}