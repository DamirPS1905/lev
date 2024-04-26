// import { Role, Token, User } from '@prisma/postgres/client';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  roles: string[];
}

export enum SystemRoles {
  User = 'User',
  Manager = 'Manager',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export interface UserInterface {
  role: string;
}
