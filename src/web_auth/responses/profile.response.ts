import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';

export class ProfileResponse {
  @Exclude()
  id: number;

  @ApiProperty({ description: 'The uuid of the user' })
  uuid: string;

  @Exclude()
  verified_code: string;

  @ApiProperty({ description: 'The avatar of the user' })
  avatar: string;

  @ApiProperty({ description: 'The first name of the user' })
  first_name: string;

  @ApiProperty({ description: 'The last name of the user' })
  last_name: string;

  @ApiProperty({ description: 'The email verification status of the user' })
  email_verified: boolean;

  @Exclude()
  role_id: number;

  @Exclude()
  role: string;

  @Exclude()
  last_login: Date;

  @Exclude()
  last_failed_login: Date;

  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  is_active: boolean;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  deleted_at: Date;

  constructor(user: any) {
    Object.assign(this, user);
  }
}
