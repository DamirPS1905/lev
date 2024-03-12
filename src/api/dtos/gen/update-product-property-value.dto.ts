import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GenUpdateProductPropertyValueDto {
	
	product:bigint;
	
	property:number;
	
	@IsNotEmpty()
	@ApiProperty()
	value:any;
	
}