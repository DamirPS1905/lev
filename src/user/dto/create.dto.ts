import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEmpty, IsJSON, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The company name' })
  company: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: 'The first name of the user' })
  first_name?: string;

  @IsString()
  @IsEmpty()
  @ApiProperty({ description: 'The last name of the user' })
  last_name?: string;

  @IsBoolean()
  @ApiProperty({ description: 'The status of the user' })
  is_active: boolean;

  @IsJSON()
  @ApiProperty({ description: 'The role of the user' })
  role: string;
}
