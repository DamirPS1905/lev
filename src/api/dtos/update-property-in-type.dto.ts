import { GenUpdatePropertyInTypeDto } from './gen/update-property-in-type.dto';
import { PropertyTuningDto } from './property-tuning.dto'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsOptional, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class UpdatePropertyInTypeDto extends GenUpdatePropertyInTypeDto {
	
	@IsOptional()
	@ApiProperty({ 
		required: false, 
		type: 'object',
	  additionalProperties: {
	    $ref: getSchemaPath(PropertyTuningDto)
	  }
	})
	@ValidateNested({ each: true })
	@Type(() => PropertyTuningDto)
	scheme:Map<string, PropertyTuningDto>;
	
}