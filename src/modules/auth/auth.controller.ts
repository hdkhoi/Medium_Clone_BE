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
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Throttle } from '@nestjs/throttler';
import { SignInDto } from './dto/signin.dto';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ login: {} })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto, @Req() req: any): Promise<any> {
    const user = await this.authService.signIn(req.user);
    return {
      message: 'Login successfully',
      data: user,
    };
  }
}
