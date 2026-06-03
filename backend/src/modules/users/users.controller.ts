import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import type { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    return await this.usersService.findOne(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(dto);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @Patch('me')
  async updateProfile(
    @GetUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(userId, updateUserDto);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async adminUpdate(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.adminUpdate(id, dto);
  }

  @Post(':id/reset-password')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async adminResetPassword(
    @Param('id') id: string,
    @GetUser('id') adminId: string,
    @Body() dto: AdminResetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.usersService.adminResetPassword(id, adminId, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @GetUser('id') userId: string,
  ): Promise<{ message: string }> {
    return await this.usersService.remove(userId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return await this.usersService.remove(id);
  }
}
