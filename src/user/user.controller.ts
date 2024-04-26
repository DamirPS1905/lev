// import { CurrentUser, Roles } from '@common/decorators';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtPayload, SystemRoles } from '@/web_auth/interfaces';

import { CurrentUser, Roles } from '@/decorators';
import { RolesGuard } from '@/web_auth/guargs/roles.guard';
import { CreateUserDto } from './dto/create.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UserResponse } from './responses';
import { UserService } from './user.service';

@ApiTags('User')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(RolesGuard)
@Roles(SystemRoles.Manager, SystemRoles.Admin)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':uuidOrEmail')
  @ApiOperation({ summary: 'Получить информацию о пользователе по UUID или email' })
  @ApiResponse({ status: 200, description: 'Успешное получение информации о пользователе', type: UserResponse })
  async findOneUser(@Param('uuidOrEmail') uuidOrEmail: string) {
    const user = await this.userService.findOne(uuidOrEmail);
    return new UserResponse(user);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete user by UUID' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  async deleteUser(@Param('id') id: number, @CurrentUser() user: JwtPayload) {
    return this.userService.delete(id, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, description: 'User successfully created' })
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return new UserResponse(user);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  async updateUser(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(uuid, dto);
    console.log(user);
    // return new UserResponse(user);
    return true;
  }
}
