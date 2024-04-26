import { HttpService } from '@nestjs/axios';

import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Cookie, CurrentUser, Public } from '@/decorators';
import { UserResponse } from '@/user/responses';
import { Response } from 'express';
import { LoginDto, RegisterDto } from './dto';
import { JwtPayload } from './interfaces';
import { ProfileResponse } from './responses';
import { WebAuthService } from './web_auth.service';

const REFRESH_TOKEN = 'refreshtoken';

@ApiTags('Web auth')
@Controller('auth')
export class WebAuthController {
  constructor(
    private readonly authService: WebAuthService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  @Public()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered', type: UserResponse })
  @ApiResponse({ status: 400, description: 'Failed to register user' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    if (!user) {
      throw new BadRequestException(`Failed to register user with data ${JSON.stringify(dto)}`);
    }

    return new UserResponse(user);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 400, description: 'Failed to login with provided data' })
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(dto);
    if (!tokens) {
      throw new BadRequestException(`Failed to login user with data ${JSON.stringify(dto)}`);
    }
    this.setRefreshTokenToCookies(tokens, res);
  }

  @Get('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.deleteRefreshToken(refreshToken);
    res.cookie(REFRESH_TOKEN, '', { httpOnly: true, secure: true, expires: new Date() });
    res.sendStatus(HttpStatus.OK);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved current user information' })
  async me(@CurrentUser() user: JwtPayload) {
    const currentUser = await this.authService.getProfile(user.id);
    return new ProfileResponse(currentUser);
  }

  @Public()
  @Get('refresh-tokens')
  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Failed to refresh tokens' })
  async refreshTokens(@Cookie(REFRESH_TOKEN) refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    try {
      const tokens = await this.authService.refreshTokens(refreshToken);
      if (!tokens) {
        throw new UnauthorizedException();
      }
      this.setRefreshTokenToCookies(tokens, res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private setRefreshTokenToCookies(tokens: any, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    const currentDate = new Date();
    const exp = new Date(currentDate);
    exp.setDate(currentDate.getDate() + 1);

    res.cookie(REFRESH_TOKEN, tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: exp,
      secure: this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
