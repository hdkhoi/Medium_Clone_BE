import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signInDto } from './dto/signin.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() req: any) {
    return this.authService.signIn(req.user);
    // const data = signInDto;

    // const user = await this.authService.validateUser(data.email, data.password);

    // return {
    //   message: 'Đăng nhập thành công',
    //   data: user,
    // };
  }
}
