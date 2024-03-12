import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GenCreateProductPropertyValueDto {
	
	product:bigint;
	
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:any;
	
}