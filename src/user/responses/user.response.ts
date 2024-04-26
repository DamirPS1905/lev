import { Actors } from '@/entities/Actors';
import { Companies } from '@/entities/Companies';
import { Users } from '@/entities/Users';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponse {
  @Exclude()
  id: number;

  @ApiProperty({ description: 'The login of the user' })
  login: string;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The first name of the user' })
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  last_name: string;

  @ApiProperty({ description: 'The is_active status of the user' })
  is_active: boolean;

  @Exclude()
  company: Companies;

  @Exclude()
  actor: Actors;

  @Exclude()
  pwdHash: string;

  @Exclude()
  role: string;

  @Exclude()
  created: Date;

  constructor(user: Users) {
    Object.assign(this, user);
  }
}
