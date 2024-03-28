import { ApiProperty } from '@nestjs/swagger'
import { IsUrl, IsOptional } from 'class-validator'
import { Transform, TransformFnParams } from 'class-transformer'

export class ImageDto {
	
	@IsOptional()
	@ApiProperty({ required: false })
	@Transform(({ value }: TransformFnParams) => value?.trim())
	@IsUrl(undefined, { message: 'Image Url is invalid' })
	url:string;
	
	status:number = 0;
	
}