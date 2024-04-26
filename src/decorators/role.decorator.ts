import { SetMetadata } from '@nestjs/common';
import { SystemRoles } from 'src/web_auth/interfaces';

export const ROLES_KEY = 'permissions';
export const Roles = (...roles: SystemRoles[]) => SetMetadata(ROLES_KEY, roles);
