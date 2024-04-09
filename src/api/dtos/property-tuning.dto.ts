import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsUrl, IsOptional } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class PropertyTuningDto {
	
	@IsOptional()
	@ApiProperty({ 
		required: false,
		oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' }
    ],
		description: 'Value used by default if value not provided'
	})
	defaultValue:number|string|boolean;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'For values with measure units can be used as unit setted by default if unit not provided' })
	defaultUnit:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Required for values with measure units; it defines group of units that can be used in this property' })
	unitsGroup:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'Required for values with measure units; it defines unit that will be used for filtering and ordering this property values' })
	storageUnit:number;
	
	@IsOptional()
	@IsInt()
	@ApiProperty({ required: false, description: 'For values with measure units can be used as unit that will be used for presenting values' })
	displayUnit:number;
	
}