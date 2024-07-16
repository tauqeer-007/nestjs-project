import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Patch,
  Delete,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/updateUser.dto';
import { MESSAGES } from 'utils/constants';
import { TransformInterceptor } from '../interceptors/transform/transform.interceptor';

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.createUser(createUserDto);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Get()
  getUsers(@Query('page') page, @Query('limit') limit = 10) {
    try {
      return this.usersService.getsUsers(page, limit);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  // users/:id
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new BadRequestException(MESSAGES.INVALID_ID);
      const findUser = await this.usersService.getUserById(id);
      if (!findUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      return findUser;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new BadRequestException(MESSAGES.INVALID_ID);
      const updatedUser = await this.usersService.updateUser(id, updateUserDto);
      if (!updatedUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      return updatedUser;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    try {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) throw new BadRequestException(MESSAGES.INVALID_ID);
      const deletedUser = await this.usersService.deleteUser(id);
      if (!deletedUser) throw new NotFoundException(MESSAGES.USER_NOT_FOUND);
      return;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
