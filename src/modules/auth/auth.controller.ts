import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signin.dto';
import { UserService } from '../user/user.service';

@Controller('users')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async signIn(@Body() signInDto: signInDto) {
    const data = signInDto;

    const existingUser = await this.userService.findByEmail(data.email);
    if (!existingUser) {
      throw new BadRequestException('Đăng nhập không thành công', {
        description: 'Email không tồn tại',
      });
    }

    const truePassword = await this.userService.checkPassword(
      data.password,
      existingUser.password,
    );
    if (!truePassword) {
      throw new BadRequestException('Đăng nhập không thành công', {
        description: 'Mật khẩu không đúng',
      });
    }

    const { password, ...result } = existingUser;

    return {
      message: 'Đăng nhập thành công',
      data: result,
    };
  }
}
