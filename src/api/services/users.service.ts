import { Injectable } from '@nestjs/common';
import { GenUsersService } from './gen/users.service';

@Injectable()
export class UsersService extends GenUsersService {
  // extra code here...
}
