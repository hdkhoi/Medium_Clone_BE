import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { IJwtPayload } from 'src/common/interfaces/IJwtPayload';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get()
  async getCurrentUser(@Req() req: any) {
    const { id } = req.user as IJwtPayload;
    const user = await this.userService.findById(id);
    return {
      message: 'Get current user successfully',
      data: user,
    };
  }

  @UseGuards(JwtGuard)
  @Put()
  async update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const { id } = req.user as IJwtPayload;
    const user = await this.userService.update(id, updateUserDto);
    return {
      message: 'User updated successfully',
      data: user,
    };
  }
}
