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
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ login: {} })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async signIn(@Req() req: any): Promise<any> {
    return this.authService.signIn(req.user);
  }
}
