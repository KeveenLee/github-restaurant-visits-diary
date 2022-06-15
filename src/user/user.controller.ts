import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  //the custom decorator @GetUser() returns request.user and affects the variable "user" with the type User from Prisma Schema, is the user found by the function validate in jwt.strategy
  @Get('me')
  getMe(@GetUser() user: User) {
    //console.log({ user: user });
    return user;
  }

  @Get(':id')
  findOne(@Param('id') userId: number) {
    return this.userService.findOne(userId);
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.update(userId, dto);
  }

  @Delete(':id')
  remove(@Param('id') userId: number) {
    return this.userService.remove(userId);
  }
}
