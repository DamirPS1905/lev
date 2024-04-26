import { Users } from '@/entities/Users';
import { EntityManager } from '@mikro-orm/postgresql';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { v4 } from 'uuid';
import { UserService } from '../user/user.service';
import { LoginDto, RegisterDto } from './dto';
import { Tokens } from './interfaces';

@Injectable()
export class WebAuthService {
  private readonly logger = new Logger(WebAuthService.name);
  constructor(
    protected readonly em: EntityManager,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async refreshTokens(refreshToken: string): Promise<Tokens> {
    const user = await this.em.findOne(Users, { refresh_token: refreshToken });
    if (!user) {
      throw new HttpException('Invalid refresh token', 420);
    }
    return this.generateTokens(user);
  }

  async register(dto: RegisterDto) {
    const user: any = await this.userService.findOne(dto.email).catch((err) => {
      this.logger.error(err);
      return null;
    });

    if (user) {
      throw new HttpException('The email is already in use', 420);
    }

    return await this.userService.create(dto);
  }

  async login(dto: LoginDto): Promise<Tokens> {
    const user: Users = await this.userService.findOne(dto.email).catch((err) => {
      this.logger.error(err);
      return null;
    });
    console.log(user);
    if (!user || !compareSync(dto.password, user.pwdHash)) {
      throw new HttpException('Incorrect email or password', 420);
    }

    return this.generateTokens(user);
  }

  async getProfile(id: number): Promise<Users> {
    return this.em.findOne(Users, { id });
  }

  private async generateTokens(user: Users): Promise<Tokens> {
    const accessToken =
      'Bearer ' +
      this.jwtService.sign({
        uuid: user.id,
        email: user.email,
        role: user.role,
      });
    const refreshToken = await this.getRefreshToken(user);
    return { accessToken, refreshToken };
  }

  private async getRefreshToken(user: Users): Promise<string> {
    user.refresh_token = v4();
    await this.em.persist(user).flush();

    return user.refresh_token;
  }

  async deleteRefreshToken(token: string) {
    const user = await this.em.findOne(Users, { refresh_token: token });
    user.refresh_token = null;
    return await this.em.persist(user).flush();
  }
}
